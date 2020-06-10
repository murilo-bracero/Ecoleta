import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { Map, TileLayer, Marker } from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet'
import Dropzone from './Dropzone'
import api from '../services/api'
import axios from 'axios'

interface Item {
    id: number
    title: string
    image_url: string
}

interface IBGEUFResponse {
    sigla: string
}

interface IBGECityResponse {
    nome: string
}

const SignupForm = () => {

    const [items, setItems] = useState<Item[]>([])
    const [ufs, setUfs] = useState<string[]>([])
    const [cities, setCities] = useState<string[]>([])

    const [initialPosition, setInicialPosition] = useState<[number, number]>([0, 0])

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: '',
        addressNumber: 0
    })

    const [selectedUf, setSelectedUf] = useState('0')
    const [selectedCity, setSelectedCity] = useState('0')
    const [selectedItems, setSelectedItems] = useState<number[]>([])
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0])
    const [selectedFile, setSelectedFile] = useState<File>()

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(pos => {
            const { latitude, longitude } = pos.coords

            setInicialPosition([latitude, longitude])
        })
    })

    useEffect(() => {
        api.get('items').then(res => {
            setItems(res.data)
        })
    }, [])

    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
            .then(res => {
                const ufInitials = res.data.map(uf => uf.sigla)

                setUfs(ufInitials)
            })
    }, [])

    useEffect(() => {
        if (selectedUf === '0') {
            return
        }

        axios.get<IBGECityResponse[]>(
            `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
        ).then(res => {
            const cityNames = res.data.map(city => city.nome)

            setCities(cityNames)
        })
    }, [selectedUf])

    const handleSelectUf = (e: ChangeEvent<HTMLSelectElement>) => setSelectedUf(e.target.value)

    const handleSelectCity = (e: ChangeEvent<HTMLSelectElement>) => setSelectedCity(e.target.value)

    const handleMapClick = (e: LeafletMouseEvent) => setSelectedPosition([e.latlng.lat, e.latlng.lng])

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        setFormData({ ...formData, [name]: value })
    }

    const handleSelectItem = (id: number) => {
        const alreadyClicked = selectedItems.findIndex(item => item === id)

        if (alreadyClicked >= 0) {
            const filteredItems = selectedItems.filter(item => item !== id)

            setSelectedItems(filteredItems)
        } else {
            setSelectedItems([...selectedItems, id])
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        const { name, email, whatsapp, addressNumber } = formData
        const uf = selectedUf
        const city = selectedCity
        const [latitude, longitude] = selectedPosition
        const items = selectedItems

        const data = new FormData()

        data.append('name', name)
        data.append('email', email)
        data.append('whatsapp', whatsapp)
        data.append('addressNumber', String(addressNumber))
        data.append('uf', uf)
        data.append('city', city)
        data.append('latitude', String(latitude))
        data.append('longitude', String(longitude))
        data.append('items', items.join(','))
        data.append('image', selectedFile || '')

        await api.post('points', data)

        alert('Ponto de coleta criado')
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>Cadastro do <br /> ponto de coleta</h1>

            <Dropzone onFileUpload={setSelectedFile} />

            <fieldset>
                <legend>
                    <h2>Dados</h2>
                </legend>

                <div className="field">
                    <label htmlFor="name">Nome da entidade</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        onChange={handleInputChange} />
                </div>

                <div className="field-group">
                    <div className="field">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            onChange={handleInputChange} />
                    </div>
                    <div className="field">
                        <label htmlFor="whatsapp">Whatsapp</label>
                        <input
                            type="tel"
                            name="whatsapp"
                            id="whatsapp"
                            pattern="[0-9]{10,11}"
                            placeholder="(  )"
                            onChange={handleInputChange} />
                    </div>
                </div>
            </fieldset>

            <fieldset>
                <legend>
                    <h2>Endereço</h2>
                    <span>Selecione o endereço no mapa</span>
                </legend>

                <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
                    <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={selectedPosition} />
                </Map>

                <div className="field-group">
                    <div className="field">
                        <label htmlFor="uf">Estado (UF)</label>
                        <select name="uf" id="uf" onChange={handleSelectUf}>
                            <option value="0">Selecione uma UF</option>
                            {
                                ufs.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="field">
                        <label htmlFor="city">Cidade</label>
                        <select name="city" id="city" onChange={handleSelectCity}>
                            <option value="0">Selecione uma Cidade</option>
                            {
                                cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>
                <div className="field">
                    <label htmlFor="addressNumber">Número</label>
                    <input
                        type="number"
                        name="addressNumber"
                        id="addressNumber"
                        onChange={handleInputChange} />
                </div>
            </fieldset>

            <fieldset>
                <legend>
                    <h2>Itens de coleta</h2>
                    <span>Selecione um ou mais dos itens abaixo</span>
                </legend>
                <ul className="items-grid">
                    {
                        items.map(item => (
                            <li
                                key={item.title}
                                onClick={() => handleSelectItem(item.id)}
                                className={selectedItems.includes(item.id) ? 'selected' : ''}
                            >
                                <img src={item.image_url} alt={item.title} />
                                <span>{item.title}</span>
                            </li>
                        ))
                    }
                </ul>
            </fieldset>

            <button type="submit">Cadastrar ponto de coleta</button>
        </form>
    )
}

export default SignupForm
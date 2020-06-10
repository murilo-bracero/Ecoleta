import React, { useState, useEffect } from 'react'
import { Feather as Icon } from '@expo/vector-icons'
import { View, Image, Text, ImageBackground } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import Select, { PickerStyle } from 'react-native-picker-select'
import styles from './styles'
import axios from 'axios'

interface IBGEUFResponse {
    sigla: string
}

interface IBGECityResponse {
    nome: string
}

const Home = () => {

    const [ufs, setUfs] = useState<string[]>([])
    const [cities, setCities] = useState<string[]>([])

    const [selectedUf, setSelectedUf] = useState('0')
    const [selectedCity, setSelectedCity] = useState('0')

    const navigation = useNavigation()

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

            cityNames.unshift('')

            setCities(cityNames)
        })
    }, [selectedUf])

    const handleNavigateToPoints = () => {

        if(!selectedCity || !selectedUf || selectedCity === '0'){
            return
        }

        navigation.navigate('Points', {
            uf: selectedUf,
            city: selectedCity
        })
    }

    return (
        <ImageBackground
            source={require('../../assets/home-background.png')}
            style={styles.container}
            imageStyle={{ width: 274, height: 368 }}
        >
            <View style={styles.main}>
                <Image source={require('../../assets/logo.png')} />
                <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
                <Text style={styles.description}>
                    Ajudamos pessoas a encontrar pontos de coleta de forma eficiente.
                </Text>
            </View>

            <View style={styles.footer}>

                <Select
                    onValueChange={value => setSelectedUf(value)}
                    items={ufs.map(uf => { return { label: uf, value: uf } })}
                />

                <Select
                    onValueChange={value => setSelectedCity(value)}
                    items={cities.map(city => { return { label: city, value: city } })}
                />

                <RectButton style={styles.button} onPress={handleNavigateToPoints} >
                    <View style={styles.buttonIcon}>
                        <Text>
                            <Icon name="arrow-right" color="#fff" size={24} />
                        </Text>
                    </View>
                    <Text style={styles.buttonText}>
                        Entrar
                    </Text>
                </RectButton>
            </View>

        </ImageBackground>
    )
}

export default Home

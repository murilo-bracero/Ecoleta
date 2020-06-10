import React, { useEffect, useState } from 'react'
import styles from './styles'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Feather as Icon, FontAwesome } from '@expo/vector-icons'
import { RectButton } from 'react-native-gesture-handler'
import { View, TouchableOpacity, Image, Text, SafeAreaView, ProgressBarAndroid, Linking } from 'react-native'
import * as MailComposer from 'expo-mail-composer'
import api from '../../services/api'

interface RouteParams {
    pointId: string
}

interface Data {

    image: string,
    name: string,
    email: string,
    whatsapp: number,
    city: string,
    uf: string,
    addressNumber: number
    items: {
        title: string
    }[]
}

const Detail = () => {
    const [data, setData] = useState<Data>({} as Data)

    const navigation = useNavigation()
    const route = useRoute()

    const routeParams = route.params as RouteParams

    useEffect(() => {
        api.get(`points/${routeParams.pointId}`)
            .then(res => {
                setData(res.data)
            })
    }, [])

    const handleNavigateBack = () => navigation.goBack()

    const handleWhatsapp = () => {
        Linking.openURL(`whatsapp://send?phone=${data.whatsapp}&text=Interesse na coleta de resíduos`)
    }

    const handleComposeMail = () => {
        MailComposer.composeAsync({
            subject: 'Interesse na coleta de resíduos',
            recipients: [data.email],
        })
    }

    if (!data.name) {
        return (
            <View
                style={[
                    styles.container,
                    {
                        justifyContent: "center",
                        alignItems: "center"
                    }
                ]}
            >
                <ProgressBarAndroid color="#34cb79" />
            </View>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <TouchableOpacity onPress={handleNavigateBack}>
                    <Icon name="arrow-left" size={20} color="#34cb79" />
                </TouchableOpacity>

                <Image style={styles.pointImage} source={{ uri: data.image }} />

                <Text style={styles.pointName}>{data.name}</Text>
                <Text style={styles.pointItems}>
                    {
                        data.items.map(item => item.title).join(', ')
                    }
                </Text>

                <View style={styles.address}>
                    <Text style={styles.addressTitle}>Endereço</Text>
                    <Text style={styles.addressContent}>
                        {data.city}, {data.addressNumber} - {data.uf}
                    </Text>
                </View>
            </View>
            <View style={styles.footer}>
                <RectButton style={styles.button} onPress={handleWhatsapp}>
                    <FontAwesome name="whatsapp" size={20} color="#FFF" />
                    <Text style={styles.buttonText}>
                        Whatsapp
                    </Text>
                </RectButton>
                <RectButton style={styles.button} onPress={handleComposeMail}>
                    <Icon name="mail" size={20} color="#FFF" />
                    <Text style={styles.buttonText}>
                        Email
                    </Text>
                </RectButton>
            </View>
        </SafeAreaView>
    )
}

export default Detail
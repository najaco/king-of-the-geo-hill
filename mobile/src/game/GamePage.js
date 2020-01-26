import React, { useState, useEffect } from 'react'
import { Colors } from '../store/Colors'
import { View } from 'react-native'
import { LargeHeader } from '../components/LargeHeader'
import { MassiveHeader } from '../components/MassiveHeader'
import Radar  from 'react-native-radar'
import { useNavigation } from 'react-navigation-hooks'

export const GamePage = () => {
    const navigation = useNavigation()
    const [team, changeTeam] = useState('NONE')
    const myTeam = navigation.getParam('team', 'auto')
    const username = navigation.getParam('username', 'null_use')
    const game_id = navigation.getParam('game_id', 'null_game')
    const [duration, setDuration] = useState(0)

    useEffect(() => {
        Radar.setUserId(username)
        Radar.requestPermissions(false)
        Radar.startTracking()
    }, [])

    useEffect(() => {
        listen(game_id, setDuration, changeTeam, navigation, myTeam)
    }, [])
    // check no one in zone
    if (team === 'NONE') {
        return (
            <View style={{backgroundColor: Colors.DARK_GRAY, height: '100%'}}>
                <View style={{margin: '5%'}}></View>
                <MassiveHeader text={duration} color={'#FFF'} fontFamily={'Call of Ops Duty'}/>
                <LargeHeader text={'ZONE IS EMPTY'} color={'#FFF'}/>
            </View>
        )
    }

    if (team === 'CONTESTED') {
        return (
            <View style={{backgroundColor: Colors.TRON_YELLOW, height: '100%'}}>
                <View style={{margin: '5%'}}></View>
                <MassiveHeader text={toString(duration)} color={'#FFF'} fontFamily={'Call of Ops Duty'}/>
                <LargeHeader text={'ZONE IS CONTESTED'} color={'#FFF'}/>
            </View>
        )
    }

    // check uncontested zone

    if (myTeam !== team) {
        return (
            <View style={{height: '100%', backgroundColor: team === 'blue' ? Colors.BLUE: Colors.TRON_RED}}>
                <View style={{height: '15%'}}></View>
                <MassiveHeader text={toString(duration)} color={'#FFF'} fontFamily={'Call of Ops Duty'}/>
                <View style={{height: '10%'}}></View>
                <LargeHeader text={team + ' is in control'} color={'#FFF' } size={64} fontFamily={'Call of Ops Duty'}/>
                <View style={{height: '10%'}}></View>
                <LargeHeader text={'reclaim the point'} color={team === 'red' ? Colors.BLUE : Colors.TRON_RED} size={36} fontFamily={'Call of Ops Duty'}/>
            </View>
        )
    } else {
        return (
            <View style={{height: '100%', backgroundColor: team === 'blue' ? Colors.BLUE: Colors.TRON_RED}}>
                <View style={{height: '15%'}}></View>
                <MassiveHeader text={toString(duration)} color={'#FFF'} fontFamily={'Call of Ops Duty'}/>
                <View style={{height: '10%'}}></View>
                <LargeHeader text={'you are in control'} color={'#FFF' } size={64} fontFamily={'Call of Ops Duty'}/>
                <View style={{height: '10%'}}></View>
                <LargeHeader text={'hold the point'} color={Colors.DARK_GRAY} size={36} fontFamily={'Call of Ops Duty'}/>
            </View>
        )
    }
}

function listen(game_id, setDuration, changeTeam, navigation, myTeam) {
    var process = setInterval(() => {
        fetch('https://bulldog.ryanjchen.com/game/score/' + game_id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            if (response.status == 200) {
                return response.json()
            }
            else {
                console.log('[error ' + response.status + ']: ' + response.statusText)
            }
        }).then(responseJson => {
            if (responseJson !== undefined) {
                console.log(responseJson['duration'])
                setDuration(responseJson['duration'])
                changeTeam(responseJson['control'])

                if (responseJson['duration'] === 0)  {
                    clearInterval(process)
                    navigation.navigate('Result', {game_id: game_id, team: myTeam})
                }
            }
        }).catch((error) => {
            console.error(error);
        });
    }, 1000)
}
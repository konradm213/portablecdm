
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    updatePortCalls,
    selectPortCall,
    toggleFavoritePortCall,
    toggleFavoriteVessel,
    appendPortCalls,
    bufferPortCalls,
    setError,
    retrieveETA,
    } from '../../actions';

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    Alert,
} from 'react-native';

import {
    SearchBar,
    Button,
    List,
    ListItem,
    Icon,
} from 'react-native-elements';

import colorScheme from '../../config/colors';
import TopHeader from '../top-header-view';
import { getDateTimeString } from '../../util/timeservices';


class PortCallList extends Component {
    state = {
        searchTerm: '',
        refreshing: false,
        numLoadedPortCalls: 20,
    }

    componentWillMount() {
        this.loadPortCalls = this.loadPortCalls.bind(this)
        this._appendPortCalls = this._appendPortCalls.bind(this);
        this.loadPortCalls()
            .then(this.props.bufferPortCalls);
    }

    loadPortCalls() {
        return this.props.updatePortCalls().then(() => {
            if(this.props.error.hasError) {
                navigate('Error');
            }
        })
            .then(this.props.retrieveETA(this.props.portCalls))
        	.then(() => this.forceUpdate());
    }

    _appendPortCalls() {
        let { portCalls, appendPortCalls, isAppendingPortCalls } = this.props;
        if (portCalls.length > 0 && !isAppendingPortCalls) {
            return appendPortCalls(portCalls[portCalls.length - 1])
            .then(this.props.retrieveETA(this.props.portCalls))
            .then(() => this.forceUpdate());
        }
    }

    checkBottom(event){
         let {layoutMeasurement, contentOffset, contentSize} = event.nativeEvent;
         const paddingToBottom = 100;
         if(!this.props.showLoadingIcon && layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
            let numLoaded = this.state.numLoadedPortCalls;

             this.setState({numLoadedPortCalls: numLoaded + 20});
             let { portCalls, appendPortCalls } = this.props;
             if(numLoaded >= portCalls.length) {
                this._appendPortCalls();
             } else {
                 console.log('Loading more local port calls. Showing ' + numLoaded + ' of ' + portCalls.length + ' port calls.');
             }
         }
    }

    render() {
        const {navigation, showLoadingIcon, portCalls, selectPortCall, subtitles} = this.props;
        const {navigate} = navigation;
        const {searchTerm} = this.state;


        // Quick fix for having 1 element with null value
        if (portCalls.length === 1) {
            portCalls.splice(0,1);
        }



        return(
            <View style={styles.container}>
                <TopHeader title="Port Calls" navigation={this.props.navigation} firstPage/>
                {/*Render the search/filters header*/}
                <View style={styles.containerRow}>
                    <SearchBar
                        autoCorrect={false}
                        containerStyle = {styles.searchBarContainer}
                        showLoadingIcon={showLoadingIcon}
                        clearIcon
                        inputStyle = {{backgroundColor: colorScheme.primaryContainerColor}}
                        lightTheme
                        placeholder='Search by name, IMO or MMSI number'
                        placeholderTextColor = {colorScheme.tertiaryTextColor}
                        onChangeText={text => this.setState({searchTerm: text})}
                        textInputRef='textInput'
                    />
                    <Button
                        containerViewStyle={styles.buttonContainer}
                        small
                        icon={{
                            name: 'filter-list',
                            size: 30,
                            color: colorScheme.primaryTextColor,
                            style: styles.iconStyle,
                        }}
                        backgroundColor = {colorScheme.primaryColor}
                        onPress= {() => navigate('FilterMenu')}
                    />
                </View>

                {/*Render the List of PortCalls*/}
                <ScrollView
                    refreshControl={
                        <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.loadPortCalls.bind(this)}
                    />
                    }
                    onScroll={this.checkBottom.bind(this)}
                    scrollEventThrottle={4}
                    >
                    <List>
                        {

                        this.search(portCalls, searchTerm, subtitles).map( (portCall) => (
                                <ListItem
                                    roundAvatar
                                    avatar={portCall.vessel.photoURL ? {uri: portCall.vessel.photoURL} : null}
                                    key={portCall.portCallId}
                                    title={portCall.vessel.name}
                                    badge={{element: this.renderFavorites(portCall)}}
                                    titleStyle={styles.titleStyle}
                                    subtitle={this.props.subtitles[portCall.portCallId]}
                                    subtitleStyle={styles.subTitleStyle}
                                    // rightTitle={portCall.stage ? portCall.stage.replace(/_/g, ' ') : undefined}
                                    // rightTitleStyle={[styles.subTitleStyle, {fontSize: 9}]}
                                    onPress={() => {
                                        console.log(JSON.stringify(portCall.vessel));
                                        selectPortCall(portCall);
                                        navigate('TimeLine')
                                    }}
                                    onLongPress={() => {
                                        Alert.alert(
                                            'Favorite ' + portCall.vessel.name,
                                            'What would you like to do?',
                                            [
                                                {text: 'Cancel'},
                                                {
                                                    text:
                                                        (this.props.favoriteVessels.includes(portCall.vessel.imo) ? 'Unf' : 'F') +
                                                        'avorite vessel',
                                                    onPress: () => {
                                                        this.props.toggleFavoriteVessel(portCall.vessel.imo);
                                                        this.props.updatePortCalls();
                                                }},
                                                {
                                                    text:
                                                        (this.props.favoritePortCalls.includes(portCall.portCallId) ? 'Unf' : 'F') +
                                                    'avorite port call', onPress: () => {
                                                    this.props.toggleFavoritePortCall(portCall.portCallId);
                                                }}
                                            ]
                                        );
                                    }}
                                />
                            ))
                        }
                    </List>
                </ScrollView>
            </View>

        );
    }

    renderFavorites(portCall) {
        let showStar = this.props.favoritePortCalls.includes(portCall.portCallId);
        let showBoat = this.props.favoriteVessels.includes(portCall.vessel.imo);
        return (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    {showStar && <Icon
                        name='star'
                        color='gold'
                    />}
                    {showBoat && <Icon
                        name='directions-boat'
                        color='lightblue'
                    />}
                    {!!portCall.stage && <Text style={[styles.subTitleStyle, {fontSize: 9, marginLeft: 4}]}>
                        {portCall.stage.replace(/_/g, ' ')}
                    </Text>}
                </View>
        );
    }
    isFavorite(portCall) {
        return this.props.favoritePortCalls.includes(portCall.portCallId) ||
        this.props.favoriteVessels.includes(portCall.vessel.imo);
    }

    sortFilters(a,b) {
        let aFav = this.isFavorite(a);
        let bFav = this.isFavorite(b);
        if (aFav && !bFav) return -1;
        if (bFav && !aFav) return 1;

        let { filters } = this.props;
        let invert = filters.order === 'ASCENDING';
        if (filters.sort_by === 'LAST_UPDATE') {
            if (a.lastUpdated > b.lastUpdated)
                 return invert ? 1 : -1;
            else return invert ? -1 : 1;
        } else if (filters.sort_by === 'ARRIVAL_DATE') {
            if (a.startTime > b.startTime)
                 return invert ? 1 : -1;
            else return invert ? -1 : 1;
        }

        return 0;
    }

    search(portCalls, searchTerm, subs) {
        let { filters } = this.props;
        if(Object.keys(subs).length > 0){
                    return portCalls.filter(portCall => {
            return (portCall.vessel.name.toUpperCase().includes(searchTerm.toUpperCase()) ||
            portCall.vessel.imo.split('IMO:')[1].startsWith(searchTerm) ||
            portCall.vessel.mmsi.split('MMSI:')[1].startsWith(searchTerm)) &&
            (!portCall.stage || filters.stages.includes(portCall.stage)); 
        }).sort((a,b) => {
                        if (subs[a.portCallId] != undefined && subs[b.portCallId] != undefined){
                        var aSub = subs[a.portCallId].split(": ");//0 is type of state, 1 is date and time.
                        var bSub = subs[b.portCallId].split(": ");
                        aSub[1] = new Date(aSub[1]);
                        bSub[1] = new Date(bSub[1]);
                        if (aSub[0] == "Actual N.O.R" && bSub[0] == "Actual N.O.R") return aSub[1]-bSub[1];
                        else if (aSub[0] == "Actual N.O.R") return -1;
                        else if (bSub[0] == "Actual N.O.R") return 1;
                        else if (aSub[0] == "Estimated N.O.R" && bSub[0] == "Estimated N.O.R") return aSub[1]-bSub[1];
                        else if (aSub[0] == "Estimated N.O.R") return -1;
                        else if (bSub[0] == "Estimated N.O.R") return 1;
                        else if (aSub[0] == "Possible N.O.R" && bSub[0] == "Possible N.O.R") return aSub[1]-bSub[1];
                        else if (aSub[0] == "Possible N.O.R") return -1;
                        else if (bSub[0] == "Possible N.O.R") return 1;
                        else if (aSub[0] == "Actual ETA" && bSub[0] == "Actual ETA") return aSub[1]-bSub[1];
                        else if (aSub[0] == "Actual ETA") return -1;
                        else if (bSub[0] == "Actual ETA") return 1;
                        else if (aSub[0] == "Estimated ETA" && bSub[0] == "Estimated ETA") return aSub[1]-bSub[1];
                        else if (aSub[0] == "Estimated ETA") return -1;
                        else if (bSub[0] == "Estimated ETA") return 1;
                        else return 0;
                    }
                    else return 0;
                    })
        ;
        }
        else {
            return portCalls.filter(portCall => {
            return (portCall.vessel.name.toUpperCase().includes(searchTerm.toUpperCase()) ||
            portCall.vessel.imo.split('IMO:')[1].startsWith(searchTerm) ||
            portCall.vessel.mmsi.split('MMSI:')[1].startsWith(searchTerm)) &&
            (!portCall.stage || filters.stages.includes(portCall.stage)); 
        });
        }

    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colorScheme.primaryColor
    },
    // Search bar and filter button
    containerRow: {
        flexDirection: 'row',
        alignItems:'center',
        marginTop: 10,
        paddingLeft: 15,
        paddingRight: 0,
    },
    searchBarContainer: {
        backgroundColor: colorScheme.primaryColor,
        flex: 4,
        marginRight: 0,
        borderBottomWidth: 0,
        borderTopWidth: 0,
    },
    // Filter button container
    buttonContainer: {
        flex: 1,
        marginRight: 0,
        marginLeft: 0,
        alignSelf: 'stretch',
    },
    iconStyle: {
        alignSelf: 'stretch',
    },
    titleStyle: {
        color: colorScheme.quaternaryTextColor,
    },
    subTitleStyle: {
        color: colorScheme.tertiaryTextColor,
    },
})

function mapStateToProps(state) {
    return {
        portCalls: state.cache.portCalls,
        cacheLimit: state.cache.limit,
        favoritePortCalls: state.favorites.portCalls,
        favoriteVessels: state.favorites.vessels,
        showLoadingIcon: state.portCalls.portCallsAreLoading,
        filters: state.filters,
        error: state.error,
        isAppendingPortCalls: state.cache.appendingPortCalls,
        subtitles: state.portCalls.subtitles
    }
}

    

export default connect(mapStateToProps, {
    updatePortCalls,
    appendPortCalls,
    selectPortCall,
    toggleFavoritePortCall,
    toggleFavoriteVessel,
    bufferPortCalls,
    setError,
    retrieveETA,
})(PortCallList);

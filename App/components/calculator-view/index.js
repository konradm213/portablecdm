import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    View,
    Picker,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
} from 'react-native';

import {
    Text,
    Button,
    SearchBar,
    List,
    ListItem
} from 'react-native-elements';

import { selectBerthLocation } from '../../actions';

import TopHeader from '../top-header-view';
import colorScheme from '../../config/colors';

export default class Calculator extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { selectLocationFor, selectLocation, navigation, onBackPress, locations } = this.props;

        return (
            <View style={styles.container}>
                <TopHeader
                    navigation={navigation}
                    title="Calculator"
                />
                <View style={styles.headerContainer} >
                  <Text style={styles.headerSubText}>{'Calculate Estimated Time for Cargo Operations'}</Text>
                </View>
                <ScrollView>
                <View style={styles.pickerTextContainer}><Text style={styles.pickerTextStyle}>Select Cargo Type</Text></View>
                <Picker
                  selectedValue={'Select Cargo'}
                  //onValueChange={(itemValue, itemIndex) => this.setState({selectedTimeType: itemValue})}
                  style={styles.pickerContainer}
                >
                  <Picker.Item label="Estimated" value="ESTIMATED" />
                  <Picker.Item label="Actual" value="ACTUAL" />
                </Picker>
                <View style={styles.pickerTextContainer}><Text style={styles.pickerTextStyle}>Type Fuel Amount</Text></View>
                <View style={styles.pickerTextContainer}><Text style={styles.pickerTextStyle}>Time Estimation</Text></View>
                <Button
                  title="Confirm"
                  buttonStyle={styles.sendButtonStyle}
                  //onPress={}
                />
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
      backgroundColor: colorScheme.primaryColor,
      alignItems: 'center',
      flexDirection: 'column',
      },
    headerSubText: {
      textAlign: 'center',
      color: colorScheme.primaryTextColor,
      fontSize: 18,
      fontWeight: 'bold',
    },
    searchBarContainer: {
        backgroundColor: colorScheme.primaryColor,
        marginRight: 0,
        borderBottomWidth: 0,
        borderTopWidth: 0,
    },
    pickerTextContainer: {
      backgroundColor: colorScheme.primaryContainerColor,
      borderColor: colorScheme.tertiaryTextColor,
      borderWidth: 1,
      borderRadius: 5,
      marginTop: 10,
      marginLeft: 10,
      marginRight: 10,
    },
    pickerTextStyle: {
      color: colorScheme.quaternaryTextColor,
      fontSize: 14,
      paddingBottom: 10,
      paddingTop: 10,
      textAlign: 'center',
      borderRadius: 5,
      overflow: 'hidden',
      fontWeight: 'bold',
    },
    pickerContainer: {
      backgroundColor: colorScheme.primaryContainerColor,
      borderColor: colorScheme.tertiaryTextColor,
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 10,
      marginLeft: 10,
      marginRight: 10,
    },
    sendButtonStyle: {
      backgroundColor: colorScheme.actualColor,
      borderColor: colorScheme.actualColor,
      borderWidth: 1,
      borderRadius: 5,
      flex: 1,
    },
    subtitle: {
        fontSize: 10,
    }
});

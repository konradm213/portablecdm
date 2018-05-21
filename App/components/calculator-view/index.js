import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    View,
    Picker,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    TextInput,
} from 'react-native';

import {
    Text,
    Button,
    SearchBar,
    List,
    ListItem,
    FormInput
} from 'react-native-elements';

import { selectBerthLocation } from '../../actions';

import TopHeader from '../top-header-view';
import colorScheme from '../../config/colors';

export default class Calculator extends Component {
    constructor(props) {
        super(props);
        this.state = {
          volume: 0,
          selectedValue: 0,
        };
    }

    updateValue = (selectedValue) => {
      this.setState({ selectedValue: selectedValue })
    }

    calcTime(volume, fuelType) {
      if (fuelType == 0) {
        volume = (volume/650.0)*60.0;
        return volume;

      } else {
        if (fuelType == 1) {
          volume = (volume/500.0)*60.0;
          return volume;}
        else {
          volume = (volume/500.0)*60.0;
          return volume;
        }}

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
                  selectedValue = {this.state.selectedValue}
                  onValueChange = {this.updateValue}
                  style={styles.pickerContainer}
                  prompt={'Cargo'}
                >
                  <Picker.Item label="Choose fuel type" value="4" />
                  <Picker.Item label="Tjockolja" value="0" />
                  <Picker.Item label="Bensin" value="1" />
                  <Picker.Item label="Diesel/Gasolja" value="2" />
                  <Picker.Item label="Annat" value="3" />
                </Picker>
                <View style={styles.pickerTextContainer}><Text style={styles.pickerTextStyle}>Type Fuel Amount (Metric Tons)</Text></View>
                <FormInput
                    keyboardType='numeric'
                    style={styles.pickerContainer}
                    placeholder="Enter weight of fuel in metric tons"
                    onChangeText={(volume, itemValue) => {
                      volume = this.calcTime(volume, this.state.selectedValue);
                      this.setState({volume});}
                    }
                    value={this.state.volume}
                    />
                <View style={styles.pickerTextContainer}><Text style={styles.pickerTextStyle}>Time Estimation</Text></View>
                <Text style={styles.infoText}>It will take {this.state.volume.toFixed(0)} minutes to fuel the vessel.</Text>
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
    searchBarContainer: {
      backgroundColor: colorScheme.primaryColor,
      flex: 3,
      marginRight: 0,
      borderBottomWidth: 0,
      borderTopWidth: 0,
    },
    infoText: {
      textAlign: 'center',
      fontSize: 16,
      marginLeft: 10,
      marginRight: 10,
      color: colorScheme.quaternaryTextColor,
      marginTop: 4
    },
    subtitle: {
        fontSize: 10,
    }
});

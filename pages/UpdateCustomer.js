import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useIsFocused } from "@react-navigation/native" 
import SelectDropdown from 'react-native-select-dropdown';

const UpdateCustomer = ({navigation, route}) => {

    const ipConfig = 'http://192.168.1.9:8090';
    const headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' }
    const isFocused = useIsFocused();
    const [branches, setBranches] = useState([]);
    const [products, setProducts] = useState([]);
    const tenors = Array.from({length: 60}, (_, index) => index + 1);
    const { item } = route.params;
    const [updatedCustomer, setUpdatedCustomer] = useState(item)
    
    const getMasterProduct = async () => {
        const response = await fetch(`${ipConfig}/GetMasterProduct`);
        const json = await response.json();
        setProducts(json.data);
    };

      const getMasterBranch = async () => {
        const response = await fetch(`${ipConfig}/GetMasterBranch`);
        const json = await response.json();
        setBranches(json.data); 
    };

    const updateCustomer = (value, key) => {
        setUpdatedCustomer({...updatedCustomer,[key]: value})
    };

    const updateDataCustomer = () => {
        const idBranch = branches.filter(branch => branch.branchName === updatedCustomer.branch)[0].branchId
        const idProduct = products.filter(product => product.productName === updatedCustomer.product)[0].productId

        fetch(`${ipConfig}/UpdateDataCust`,{
            method: 'POST',
            headers: headers,
            body: JSON.stringify({...updatedCustomer, product : idProduct, branch : idBranch}),
        }).then(navigation.navigate("Form"))
    };

    const backButton = () => {
        navigation.navigate("Form");
    };

    useEffect(() => {
        getMasterProduct();
        getMasterBranch();
    }, [isFocused]);

    
    return (
        <View>
            <View style = {{ paddingTop: 10, padding: 8 }}>
                <Text style = {{ marginLeft:100, marginRight: 50, marginBottom: 50, fontSize: 25, fontWeight: "bold" }}>
                    Update Data Customer
                </Text>
                <TextInput
                    style = {{ height: 40, margin: 12, padding: 10, borderBottomWidth: 1}}
                    placeholder = {'First Name'}
                    maxLength = {30}
                    onChangeText = {(value) => updateCustomer(value,'firstName')}
                    value = {updatedCustomer.firstName}
                />
                <TextInput
                    style = {{ height: 40, margin: 12, padding: 10, borderBottomWidth: 1}}
                    placeholder = {'Last Name'}
                    maxLength = {30}
                    onChangeText = {(value) => updateCustomer(value,'lastName')}
                    value = {updatedCustomer.lastName}
                />
                <TextInput
                    style = {{ height: 40, margin: 12, padding: 10, borderBottomWidth: 1}}
                    placeholder = {'Phone Number'}
                    maxLength = {13}
                    onChangeText = {(value) => updateCustomer(value,'phoneNumber')}
                    value = {updatedCustomer.phoneNumber}
                    keyboardType = "numeric"
                />
                <SelectDropdown
                    buttonStyle = {{ marginTop: 30, marginRight: 100, marginLeft: 100, backgroundColor: '#fff', margin:12, width: '50%', borderWidth: 2 }}
                    buttonTextStyle = {{ textAlign: 'left' }}  
                    data = {branches.map((res) => res.branchName)}
                    onSelect = {(selectedItem,_) => { updateCustomer(selectedItem,'branch') }}
                    buttonTextAfterSelection = {(selectedItem) => { return selectedItem; }}
                    rowTextForSelection = {(item) => item }
                    defaultButtonText = {updatedCustomer.branch}                                        
                />  
                <SelectDropdown
                    buttonStyle = {{ marginRight: 100, marginLeft: 100, backgroundColor: '#fff', margin:12, width: '50%', borderWidth: 2 }}
                    buttonTextStyle = {{ textAlign: 'left' }}   
                    data = {products.map((res) => res.productName)}
                    onSelect = {(selectedItem,_) => { updateCustomer(selectedItem,'product') }}
                    buttonTextAfterSelection = {(selectedItem) => { return selectedItem; }}
                    rowTextForSelection = {(item) => item }
                    defaultButtonText = {updatedCustomer.product}                                      
                />  
                <SelectDropdown
                    buttonStyle = {{ marginRight: 100, marginLeft: 100, backgroundColor: '#fff', margin:12, width: '50%', borderWidth: 2 }}
                    buttonTextStyle = {{ textAlign: 'left' }}  
                    data = {tenors}
                    onSelect = {(selectedItem) => { updateCustomer(selectedItem,'tenor') }}
                    buttonTextAfterSelection = {(selectedItem) => { return selectedItem; }}
                    rowTextForSelection = {(item) => item }
                    defaultButtonText = {updatedCustomer.tenor}                 
                />  
                <View style = {{ margin: 12, width: '100%', alignItems: 'center', marginTop: 40 }}>
                    <Button color = "#1f946d" title = "Update" onPress = {updateDataCustomer} />
                </View>
                <View style = {{ margin: 12, width: '100%', alignItems: 'center', marginBottom: 60 }}>
                    <Button color = "#5da154" title = "Back" onPress = {backButton} />
                </View>
            </View>
        </View>  
)};

export default UpdateCustomer;
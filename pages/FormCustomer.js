import React, { useState, useEffect } from 'react';
import { View, Text, Image, Modal, Button, FlatList, TextInput } from 'react-native';
import { useIsFocused } from "@react-navigation/native" 
import SelectDropdown from 'react-native-select-dropdown';
  
const FormCustomer = ({ navigation }) => {
  
      const ipConfig = 'http://192.168.1.9:8090';
      const headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' }
      const isFocused = useIsFocused();
      const [customers, setCustomers] = useState([]);
      const [branches, setBranches] = useState([]);
      const [products, setProducts] = useState([]);
      const tenors = Array.from({ length: 60 }, (_, index) => index + 1);
      const [insertedCustomer, setInsertedCustomer] = useState({
          firstName   : "",
          lastName    : "",
          phoneNumber : "",
          branch      : "",
          product     : "",
          tenor       : ""
      });
      const [modalVisible, setModalVisible] = useState(false);
      const [deletedCustomerId, setDeletedCustomerId] = useState(0);

      const getAllDataCustomer = async () => {
        const response = await fetch(`${ipConfig}/GetAllDataCust`);
        const json = await response.json();
        setCustomers(json.data);
      };

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
    
      const insertNewCustomer = (value, key) => {
        setInsertedCustomer({...insertedCustomer,[key]: value})
      };
  
      const saveDataCustomer = async () => {
          const idBranch = branches.filter(branch => branch.branchName === insertedCustomer.branch)[0].branchId
          const idProduct = products.filter(product => product.productName === insertedCustomer.product)[0].productId

          await fetch(`${ipConfig}/SaveDataCust`,{
              method: 'POST',
              headers: headers,
              body: JSON.stringify({...insertedCustomer, product : idProduct, branch : idBranch}),
          })
          await getAllDataCustomer();
          clearButton();
      };
  
      const showModalDeleteConfirmation = (value) => {
          setModalVisible(true);
          setDeletedCustomerId(value);
      };
  
      const deleteDataCustomer = async () => {
          await fetch(`${ipConfig}/DeleteDataCust`,{
              method: 'POST',
              headers: headers,
              body: JSON.stringify({ id: deletedCustomerId }),
          })         
          await getAllDataCustomer();
          setModalVisible(false);
      };

      const clearButton = () => {
        setInsertedCustomer({
            firstName   : "",
            lastName    : "",
            phoneNumber : "",
            branch      : "",
            product     : "",
            tenor       : ""
        })
      };
  
      useEffect(() => {
        getAllDataCustomer();
        getMasterProduct();
        getMasterBranch();
      }, [isFocused]);
  
      const renderListCustomer = ({ item }) => {
          return (  
              <View style = {{ backgroundColor: '#fff' }}>
                  <Modal transparent = {true} visible = {modalVisible} onRequestClose = {() => {setModalVisible(!modalVisible); }}>
                      <View style = {{ marginTop: 270, marginBottom: 400, marginLeft: 70, marginRight: 70, backgroundColor: "#d3f5ef", padding: 10, alignItems: "center", borderWidth: 2}}>
                        <View style = {{ alignItems: "center", borderBottomWidth: 1, width: "100%", marginBottom: 40 }}>
                            <Text style = {{ fontSize:17, fontWeight:"bold", textAlign: "center" }}>
                                CONFIRMATION
                            </Text>
                        </View>
                        <Text style = {{ fontSize: 18, textAlign: "center" }}>
                              Confirm to Delete ?
                        </Text>
                          <View>
                              <View style = {{ margin: 2, flex: 3, flexDirection:"row" }}>
                                  <View style = {{ margin: 12 }}>
                                      <Button color = "#60696e" title = "Back" onPress = {() => setModalVisible(!modalVisible)} />
                                  </View>
                                  <View style = {{ margin: 12 }}>
                                      <Button color = "#198ccf" title = "Yes, Delete it" onPress = {(deleteDataCustomer)} />
                                  </View>              
                              </View>   
                          </View>                                                             
                      </View>
                  </Modal>
  
                  <View style = {{ borderBottomWidth: 1, borderTopWidth: 1, flexDirection: "row" }}>
                      <View style = {{ marginTop:10, marginLeft: 10, marginRight:0, flex: 3 }}>
                          <Image style = {{ width: 80, height: 100 }} source = {{ uri: item.avatar }} />
                      </View>
                      <View style = {{ marginTop: 10, marginBottom : 10, flexDirection:"row", flex:10 }}>                     
                          <View style = {{ flex:50 }}>
                              <Text style = {{ color: "#278f7a", fontSize:20, fontWeight: 'bold' }} 
                                    onPress = { () => navigation.navigate('Update', { item: item }) } >
                                  { item.firstName + '  ' + item.lastName }
                              </Text>
                              <Text>
                                  Branch Name: { item.branch }
                              </Text>
                              <Text>
                                  Product Name: { item.product }
                              </Text>
                              <Text>
                                  Tenor: { item.tenor }
                              </Text>                     
                          </View>
                          <View >
                                <Text style = {{ marginRight:10, fontSize: 20, color: "red", fontWeight: 'bold' }} 
                                      onPress = { () => showModalDeleteConfirmation(item.custId) }>
                                    X
                                </Text>
                          </View>                                 
                      </View>                         
                  </View>  
              </View>
          );
      };
  
      return (
          <View>
              <FlatList data = {customers} renderItem = {renderListCustomer} keyExtractor = {(customer) => customer.custId} ListHeaderComponent = { <>
                  <View style = {{ paddingTop: 20, padding: 8 }}>
                      <Text style = {{ marginLeft:120, marginRight: 100, marginBottom: 50, fontSize: 25, fontWeight: "bold" }}>
                          Form Data Customer
                      </Text>
                      <TextInput
                          style = {{ height: 40, margin: 12, padding: 10, borderBottomWidth: 1 }}
                          placeholder = {'First Name'}
                          onChangeText = {(value) => insertNewCustomer(value,'firstName')}
                          value = { insertedCustomer.firstName }
                          maxLength = {30}
                      />
                      <TextInput
                          style = {{ height: 40, margin: 12, padding: 10, borderBottomWidth: 1 }}
                          placeholder = {'Last Name'}
                          onChangeText = {(value) => insertNewCustomer(value,'lastName')}
                          value = { insertedCustomer.lastName }
                          maxLength = {30}
                      />
                      <TextInput
                          style = {{ height: 40, margin: 12, padding: 10, borderBottomWidth: 1 }}
                          placeholder = {'Phone Number'}
                          onChangeText = {(value) => insertNewCustomer(value,'phoneNumber')}
                          value = { insertedCustomer.phoneNumber }
                          maxLength = {13}
                          keyboardType = "numeric"
                      />
                      <SelectDropdown
                          buttonStyle = {{ marginTop: 30, marginRight: 100, marginLeft: 100, backgroundColor: '#fff', margin:12, width: '50%', borderWidth: 2 }}
                          buttonTextStyle = {{ textAlign: 'left' }}  
                          data = {branches.map((res) => res.branchName)}
                          onSelect = {(selectedItem,_) => { insertNewCustomer(selectedItem,'branch') }}
                          buttonTextAfterSelection = {(selectedItem) => { return selectedItem; }}
                          rowTextForSelection = {(customer) => customer }
                          defaultButtonText = {'- Select Branch -'}                                        
                      />  
                      <SelectDropdown
                          buttonStyle = {{ marginRight: 100, marginLeft: 100, backgroundColor: '#fff', margin:12, width: '50%', borderWidth: 2 }}
                          buttonTextStyle = {{ textAlign: 'left' }}   
                          data = {products.map((res) => res.productName)}
                          onSelect = {(selectedItem,_) => { insertNewCustomer(selectedItem,'product') }}
                          buttonTextAfterSelection = {(selectedItem) => { return selectedItem; }}
                          rowTextForSelection = {(customer) => customer }
                          defaultButtonText = {'- Select Product -'}                                      
                      />  
                      <SelectDropdown
                          buttonStyle = {{ marginRight: 100, marginLeft: 100, backgroundColor: '#fff', margin:12, width: '50%', borderWidth: 2 }}
                          buttonTextStyle = {{ textAlign: 'left' }}  
                          data = {tenors}
                          onSelect = {(selectedItem) => { insertNewCustomer(selectedItem,'tenor') }}
                          buttonTextAfterSelection = {(selectedItem) => { return selectedItem; }}
                          rowTextForSelection = {(customer) => customer }
                          defaultButtonText = {'- Select Tenor -'}                 
                      />  
                      <View style = {{ margin: 12, width: '90%', alignItems: 'center', marginLeft: 30, marginTop: 40 }}>
                          <Button color = "#1f946d" title = "Submit" onPress = {saveDataCustomer} />
                      </View>
                      <View style = {{ margin: 12, width: '90%', alignItems: 'center', marginLeft: 30, marginBottom: 60 }}>
                          <Button color = "#5da154" title = "Clear Form" onPress = {clearButton} />
                      </View>
                  </View>
              </> }
              ListFooterComponent = { <></> } />     
          </View> 
      );
  };
  
export default FormCustomer;
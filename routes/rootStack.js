import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FormCustomer from '../pages/FormCustomer';
import UpdateCustomer from '../pages/UpdateCustomer';

const Stack = createStackNavigator();

const rootStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen name = "Form" component = { FormCustomer } />
        <Stack.Screen name = "Update" component = { UpdateCustomer } /> 
      </Stack.Navigator>
    );
};
  
export default rootStack;
import { createContext } from 'react';

interface MyContextType {

    vendorStatus: any;
    setVendorStatus: React.Dispatch<React.SetStateAction<any>>;
}

const VendorStatusContext = createContext<MyContextType>({

    vendorStatus: '',
    setVendorStatus: () => { },


});

export default VendorStatusContext;
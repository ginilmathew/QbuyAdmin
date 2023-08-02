
import React, { useState, useEffect } from "react";
import Context from "./index";

const VendorStatusProvider = (props: any) => {

    const [vendorStatus, setVendorStatus] = useState<any>('');


    return (
        <Context.Provider
            value={{
                ...props,
                vendorStatus,
                setVendorStatus

            }}
        >
            {props.children}
        </Context.Provider>
    );
}

export default VendorStatusProvider;

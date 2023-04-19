
import React, { useState, useEffect } from "react";
import Context from "./index";

const UserProvider = (props: any) => {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState('');
    const [tokens,setTokens]=useState('')

    return (
        <Context.Provider
            value={{
                ...props,
                tokens,
                loading,
                setLoading,
                setTokens,
                user,
                setUser

            }}
        >
            {props.children}
        </Context.Provider>
    );
}

export default UserProvider;

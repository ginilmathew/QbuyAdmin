
import React, { useState, useEffect } from "react";
import Context from "./index";

const UserProvider = (props: any) => {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState('');

    return (
        <Context.Provider
            value={{
                ...props,
                loading,
                setLoading,
                user,
                setUser

            }}
        >
            {props.children}
        </Context.Provider>
    );
}

export default UserProvider;

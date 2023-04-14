
import React, { useState, useEffect } from "react";
import Context from "./index";

const HeaderProvider = (props: any) => {
    const [loading, setLoading] = useState(false);
    const [header, setHeader] = useState(null);

    return (
        <Context.Provider
            value={{
                ...props,
                header,
                setHeader

            }}
        >
            {props.children}
        </Context.Provider>
    );
}

export default HeaderProvider;

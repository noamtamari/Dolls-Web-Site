import { useState, useEffect } from 'react';
import axios from 'axios';

export function LoginData() {
    const [isLogin, setIsLogin] = useState(false);

    useEffect(() => {
        axios
            .get('/api/get-login', { withCredentials: true })
            .then(response => {
                console.log(response)
                setIsLogin(JSON.parse(response.data));
            })
            .catch(error => {
                console.error(error);
            });
    }, []);
    return isLogin;
}


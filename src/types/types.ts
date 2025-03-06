export interface AuthResponse{
    body: {
        user: User;
        parqueadero: parqueadero;
        accessToken: string;
        refreshToken: string;
    };

}

export interface AuthResponseError{
    body:{
        error: string;
    }
}


export interface User{
    _id: string;
    name: string;
    username: string;
}
export interface parqueadero{
    _id: string;
    nombre: string;
    longitud: string;
    altura:string ;
}

export interface AccessTokenResponse{
    statusCode: number;
    body: {
        accesToken: string;
    };
    error?: string;
    
}
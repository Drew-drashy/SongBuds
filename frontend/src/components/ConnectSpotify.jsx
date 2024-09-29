import React, { useEffect } from 'react';
import queryString from 'query-string';
function ConnectSpotify(){
    function generateRandomString(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
      }
    useEffect(()=>{
        const client_id="0abe156384ac404da4a402c5f8c6a7f1";
        console.log(client_id);
        const uri="http://localhost:5000/api/auth/callback";
        console.log(uri);
        var state = generateRandomString(16);
        const spotifyAuthUrl = 'https://accounts.spotify.com/authorize?' +
      queryString.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: 'user-read-private user-read-email',
        redirect_uri: uri,
        state: state,
      });
      window.location.href=spotifyAuthUrl;
      

    },[])
    
    return(
        <></>
    )
}
export default ConnectSpotify
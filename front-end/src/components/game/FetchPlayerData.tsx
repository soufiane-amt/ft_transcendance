

const FetchPlayerData = async (url: string, token: string , player_id: string): Promise<any> => {
    const headers : HeadersInit = { 'Authorization': token, user: player_id };
    const options : RequestInit = { headers, method: "GET" };
    const response: Response = await fetch(url, options);
    if (response.ok !== true) {
        throw new Error(`could not fetch resource from ${url}`);
    } else {
        return await response.json();
    }
}
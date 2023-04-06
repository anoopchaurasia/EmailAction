export default class Utility {
    static multipart = async response => {
        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('multipart/mixed')) {
            const boundary = contentType.split('boundary=')[1];
            return response.text().then(text => {
                const parts = text.split(`--${boundary}`);
                return parts.map(part => {
                    const [headers, ...body] = part.split('\r\n\r\n');
                    return { headers: headers, body: body.filter(x => x && x.trim()[0] == "{").map(x => {
                        try{
                           return JSON.parse(x)
                        } catch(e) {
                            console.error(x, "ererer")
                        } }
                        )[0] };
                });
            });
        }
    }
}

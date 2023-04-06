

export default function multiparts(response) {

    const contentType = response.headers.get('Content-Type');
    let datalist = [];
    if (contentType && contentType.includes('multipart/mixed')) {
      const boundary = contentType.split('boundary=')[1];
      return response.text().then(text => {
        const parts = text.split(`--${boundary}`);
        return parts.map(part => {
          const [headers, ...body] = part.split('\r\n\r\n');
          return body.filter(x=>x && x.trim()[0]=="{").map(x => JSON.parse(x));
        });
      });
    }
}

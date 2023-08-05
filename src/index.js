import app from "./app";

app.listen(app.get('port'))

console.log('servidor activo en puerto: ', app.get('port'));
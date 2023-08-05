export const FechaDeHoy = () => {
    let Fecha = new Date();
    let Mes = Fecha.getMonth() + 1;
    let Dia = Fecha.getDate();
    let Anio = Fecha.getFullYear();      
    return `${Anio}-` + `${Mes.toString().length > 1? Mes: '0' + Mes}-${Dia.toString().length > 1? Dia: '0' + Dia}`;
}

export const removerComas = (number) => {
    let arr = number.toString().split('.');
    arr[0] = arr[0].replace(/\D/g,"");
    return arr[1] ? arr.join('.') : arr[0];
}

export const datesAreEquality = ( date1, date2 ) => {
    if ( date1 > date2 ) return false;
    else if ( date1 < date2 ) return false;
    else return true;
}

export const invertirCadenaFecha = ( fecha ) => {
    let dia = fecha.slice(0,4)
    let mes = fecha.slice(5,7)
    let anio = fecha.slice(8,10)
    let ordenarFecha = [anio, mes, dia]
    let fechaFinal = ordenarFecha.join('-');
    return fechaFinal;
}

export const revertDate = ( date ) => {

    let [ day, month, year ] = date.split('/');

    return `${year}-${month}-${day}`;

}
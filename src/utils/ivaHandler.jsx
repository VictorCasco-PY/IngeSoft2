export const iva = (iva) =>{
    switch(iva){
        case 0.1:
            return 10
        case 0.05:
            return 5
        default:
            return 0
    }
}
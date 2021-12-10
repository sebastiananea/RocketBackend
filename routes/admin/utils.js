function devolverPorFecha(data){
    var res = {}
    data.forEach(x =>{
      var fecha = x.date.split("-")
      var mesAño = fecha[1].concat("-").concat(fecha[2])
      if(res[mesAño])res[mesAño].push(x)
      else res[mesAño] = [x]
    })
    var resultado = []
    for(x in res){
        resultado.push({name:x,cantidad:res[x].length})
    }
  return resultado
   
 }

module.exports=(
    {devolverPorFecha}
)

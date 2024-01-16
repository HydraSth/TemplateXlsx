

function convertExcelToJson(file) {
	let reader = new FileReader();
	reader.onload = function (e) {
		const data = new Uint8Array(e.target.result);
		const workbook = XLSX.read(data, { type: "array" });
		const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1 });

		//#region Script para guardar en el local storage info proveedor
		// const OBJ=[];
		// jsonData.forEach((element, index) => {
		// 	OBJ.push({
		// 		cod_barra: (element[0] ? element[0]: ' '),
		// 		sku: element[1] ? element[1]: ' ',
		// 	})
		// })

		// localStorage.setItem('Codigo_De_Barra', JSON.stringify(OBJ));
		//#endregion

		// Obtener datos del localStorage
		 const localStorageData = JSON.parse(localStorage.getItem('Codigo_De_Barra'));

	    // Crear arreglo de objetos con SKU desde la planilla
		const SKUArray = jsonData.map(element => ({ sku: element[0] }));

		// Crear relaciones entre SKU de la planilla y vehículos del localStorage
		const relaciones = [];
		
		SKUArray.forEach((skuPlanilla) => {
			localStorageData.forEach((catalogoItem) => {
				if (skuPlanilla.sku === catalogoItem.sku + 'MI' || skuPlanilla.sku === catalogoItem.sku) {
					relaciones.push({
						sku: catalogoItem.sku,
						codigo: [catalogoItem.cod_barra]
					})
				}
			})
		});


		const arrayUnificado = relaciones.reduce((resultado, objeto) => {
			const objetoExistente = resultado.find((elemento) => elemento.sku === objeto.sku);
			
			if (objetoExistente) {
			  objetoExistente.codigo.push(objeto.codigo);
			} else {
			  resultado.push({ sku: objeto.sku, codigo: [objeto.codigo] });
			}
			
			return resultado;
		  }, []);

		console.log(relaciones);
		console.log(arrayUnificado);

	};
	reader.readAsArrayBuffer(file);
}

document.getElementById("fileUpload").addEventListener("change", function (e) {
	convertExcelToJson(e.target.files[0])
})

function imprimirExcel(jsonData) {
	// Crear una hoja de cálculo a partir del JSON
	const workbook = XLSX.utils.book_new();
	const worksheet = XLSX.utils.json_to_sheet(jsonData);
	XLSX.utils.book_append_sheet(workbook, worksheet, 'SKU-MIGRACIION Moura-BAT');
  
	// Guardar el archivo Excel
	const nombreArchivo = 'SKU-MIGRACIION Moura-BAT';
	XLSX.writeFile(workbook, nombreArchivo);
	
	console.log(`El archivo ${nombreArchivo} se ha creado correctamente.`);
}


/*
		// Obtener datos del localStorage
		const localStorageData = JSON.parse(localStorage.getItem('data'));

		// Crear arreglo de objetos con SKU desde la planilla
		const SKUArray = jsonData.map(element => ({ sku: element[0] }));

		// Crear relaciones entre SKU de la planilla y vehículos del localStorage
		const relaciones = [];
		SKUArray.forEach((skuPlanilla) => {
			localStorageData.forEach((catalogoItem) => {
				if (skuPlanilla.sku === catalogoItem.sku_bateria) {
					relaciones.push({
						sku: catalogoItem.sku_bateria,
						vehiculo: catalogoItem.coche
					});
				}
			});
		});

		//#region Organizar relaciones en un objeto por SKU y eliminar duplicados de vehículos
		const resultado = relaciones.reduce((acc, item) => {
			const sku = item.sku;
			const vehiculo = item.vehiculo;

			if (!acc[sku]) {
				acc[sku] = { sku, vehiculos: [] };
			}

			if (!acc[sku].vehiculos.includes(vehiculo)) {
				acc[sku].vehiculos.push(vehiculo);
			}

			return acc;
		}, {});
		//#endregion

		// Unifica los vehiculos en un solo string
		for (const sku in resultado) {
			resultado[sku].vehiculos = resultado[sku].vehiculos.join(', ');
		}

		console.log(Object.values(resultado));
		imprimirExcel(Object.values(resultado));

*/




// Function to convert Excel data to JSON
// function convertExcelToJson(file) {
// 	let reader = new FileReader();
// 	reader.onload = function (e) {
// 		let data = new Uint8Array(e.target.result);
// 		let workbook = XLSX.read(data, { type: "array" });

// 		let jsonData = XLSX.utils.sheet_to_json(
// 			workbook.Sheets[workbook.SheetNames[0]],
// 			{ header: 1 }
// 		);

// 		// 	const OBJ=[];
// 		// jsonData.forEach((element, index) => {
// 		// 	OBJ.push({
// 		// 		marca: element[0] ? element[0]: '-',
// 		// 		modelo: element[1] ? element[1]: '-',
// 		// 		aceite: element[4] ? element[4]: '-',
// 		// 		aire: element[6] ? element[6]: '-',
// 		// 	})
// 		// })

// 		// localStorage.setItem('data', JSON.stringify(OBJ));
		
// 		const localStorageData= JSON.parse(localStorage.getItem('data'));
// 		const OBJ=[];
// 		jsonData.forEach((element, index) => {
// 			OBJ.push({
// 				sku: element[0],
// 			})
// 		})
// 		const Relaciones=[]
// 		OBJ.forEach((SkuPlanilla, index) => {
// 			localStorageData.forEach((CatalogoItem, index2) => {				
// 				if(SkuPlanilla.sku==CatalogoItem.aceite){
// 					Relaciones.push({
// 						sku: SkuPlanilla.sku,
// 						vehiculo :`${CatalogoItem.marca} ${CatalogoItem.modelo}`,
// 					})
// 				}
// 				if(SkuPlanilla.sku==CatalogoItem.aire){
// 					Relaciones.push({
// 						sku: SkuPlanilla.sku,
// 						vehiculo :`${CatalogoItem.marca} ${CatalogoItem.modelo}`,
// 					})
// 				}
// 			})
// 		})

		
// 		const result = {};

// 		for (const item of Relaciones) {
// 			const sku = item.sku;
// 			const vehiculo = item.vehiculo;

// 			if (result.hasOwnProperty(sku)) {
// 				result[sku].vehiculos.push(vehiculo);
// 			} else {
// 				result[sku] = {
// 				sku,
// 				vehiculos: [vehiculo],
// 				};
// 			}
// 		}

// 		const resultado = Object.entries(result).reduce((acc, [sku, item]) => {
// 			const vehiculos = item.vehiculos.reduce((acc, vehiculo) => {
// 			  const existingVehiculo = acc.find((vehiculoExistente) => vehiculoExistente === vehiculo);
		  
// 			  if (!existingVehiculo) {
// 				acc.push(vehiculo);
// 			  }
		  
// 			  return acc;
// 			}, []);
		  
// 			acc[sku] = { sku, vehiculos };
		  
// 			return acc;
// 	  }, {});

// 		  console.log(Object.values(resultado));

// 		//   imprimirExcel(Object.values(resultado));
// 	};

// 	reader.readAsArrayBuffer(file);
// }

  		// const marcas = ['shell', 'moura', 'nexen', 'pace', 'marcher', 'firestone', 'fric rot', 'monroe', 'moog', 'arcucci', 'cobreq', 'ypf', 'triangle', 'firemax', 'kumho', 'pirelli', 'gulf', 'italbo', 'bridgestone', 'aplus', 'metzeler', 'windforce', 'west lake', 'unimax', 'formula energy', 'formula evo', 'fram', 'total quartz', 'sermat'];
		// let OBJ=[];
		// jsonData.forEach(element => {
		// 	OBJ.push({descripcion:element[1]})
		// });
		
		// OBJ.forEach((element, index) => {
		// 	marcas.forEach((marca, index) => {
		// 		// console.log(`${element.marca} ${element.descripcion.toString().toLowerCase().includes(marca)} ${marca}`);
		// 		if (element.descripcion.toString().toLowerCase().includes(marca)) {
		// 			element.marca = marca
		// 			element.cod_marca= marcas.indexOf(marca)+1
		// 		}
		// 	});
		// })
		
		// let Rubros=[]
		// let OBJ=[];
		// jsonData.forEach(element => {
		// 	OBJ.push({descripcion:element[1], cod_rubro:0})
		// });
		
		// OBJ.forEach((element, index) => {
		// 	if(Rubros.indexOf(element.descripcion)==-1){
		// 		Rubros.push(element.descripcion)
		// 	}
		// 	if(Rubros.indexOf(element.descripcion)!=-1 && element.cod_rubro==0){
		// 		element.cod_rubro=Rubros.indexOf(element.descripcion)
		// 	}
		// })


		// const OBJ=[];
		// jsonData.forEach((element, index) => {
		// 	OBJ.push({
		// 		marca: element[0] ? element[0]: '-',
		// 		modelo: element[1] ? element[1]: '-',
		// 		aceite: element[4] ? element[4]: '-',
		// 		aire: element[6] ? element[6]: '-',
		// 	})
		// })

		// localStorage.setItem('data', JSON.stringify(OBJ));
		// console.log(OBJ);
		// imprimirExcel(OBJ);
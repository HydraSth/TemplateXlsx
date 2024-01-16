function convertExcelToJson(file) {
	let reader = new FileReader()
	reader.onload = function (e) {
		const data = new Uint8Array(e.target.result)
		const workbook = XLSX.read(data, { type: "array" })
		const jsonData = XLSX.utils.sheet_to_json(
			workbook.Sheets[workbook.SheetNames[0]],
			{ header: 1 }
		)

		// const ExcelJsonSkuOnly = jsonData.map(element => ({ sku: element[0], descripcion: element[1] }));
		// localStorage.setItem('SKU_MIGRACIION', JSON.stringify(ExcelJsonSkuOnly));

		// Obtener datos del localStorage
		const SkuMigracion = JSON.parse(localStorage.getItem("SKU_MIGRACIION"))
		let DbVehiculos = []
		jsonData.forEach((element) => {
			DbVehiculos.push({
				sku: [],
				nombre:
					(element[1] ? element[1] + " " + element[3] + " " : "") +
					(element[4] ? element[4] : ""),
				medidas: element[14],
			})
		})

		DbVehiculos.forEach((vehiculo) => {
			SkuMigracion.forEach((producto) => {
				if (producto.descripcion.includes(vehiculo.medidas)) {
					vehiculo.sku.push(producto.sku)
				}
			})
		})

		DbVehiculos.forEach((vehiculo) => {
			vehiculo.sku = vehiculo.sku.join(", ")
		})

		const objetos = DbVehiculos

		const objetosAgrupados = {}

		objetos.forEach((objeto) => {
			const skus = objeto.sku.split(", ")

			skus.forEach((sku) => {
				if (!objetosAgrupados[sku]) {
					objetosAgrupados[sku] = {
						sku: sku,
						familia: [objeto.nombre]
					}
				} else {
					objetosAgrupados[sku].familia.push(objeto.nombre)
				}
			})
		})

		for (const sku in objetosAgrupados) {
			objetosAgrupados[sku].familia =
				objetosAgrupados[sku].familia.join(", ")
		}
		console.log(objetosAgrupados)
		// imprimirExcel(objetosAgrupados);
	}
	reader.readAsArrayBuffer(file)
}

document.getElementById("fileUpload").addEventListener("change", function (e) {
	convertExcelToJson(e.target.files[0])
})

function imprimirExcel(jsonData) {
	const arrayData = Object.values(jsonData).map(obj => obj);
	// Crear una hoja de cálculo a partir del JSON
	const workbook = XLSX.utils.book_new()
	const worksheet = XLSX.utils.json_to_sheet(arrayData)
	XLSX.utils.book_append_sheet(workbook, worksheet, "Modelos hasta 2019")

	// Guardar el archivo Excel
	const nombreArchivo = "NeumaticosVehciulosVinculadoSku-15-2024.xlsx"
	XLSX.writeFile(workbook, nombreArchivo)

	console.log(`El archivo ${nombreArchivo} se ha creado correctamente.`)
}

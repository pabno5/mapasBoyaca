// Inicializar el mapa
var map = L.map('map').setView([5.605, -73.161], 9);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: 'TIC'
}).addTo(map);

var markers = []; // Almacenar los marcadores para buscarlos después

// Crear un icono personalizado
function createCustomIcon(color) {
    return L.divIcon({
        className: "custom-icon",
        html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%;"></div>`,
        iconSize: [12, 12]
    });
}

// Cargar el archivo Excel automáticamente
fetch('ubicacionCorrectaF.xlsx')
    .then(response => response.arrayBuffer())
    .then(data => {
        var workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
        var sheetName = workbook.SheetNames[0];
        var sheet = workbook.Sheets[sheetName];
        var jsonData = XLSX.utils.sheet_to_json(sheet);

        GUTI
    })
    .catch(error => console.error('Error al cargar el archivo Excel:', error));
     // Cargar el archivo Excel automáticamente
       fetch('ubicacionCorrectaF.xlsx')
            .then(response => response.arrayBuffer())
            .then(data => {
                var workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
                var sheetName = workbook.SheetNames[0];
                var sheet = workbook.Sheets[sheetName];
                var jsonData = XLSX.utils.sheet_to_json(sheet);

                jsonData.forEach(colegio => {
                    if (colegio.LATITUD && colegio.LONGITUD) {
                        var marker = L.marker([parseFloat(colegio.LATITUD), parseFloat(colegio.LONGITUD)]).addTo(map);
                        marker.bindPopup(`<b>${colegio.NOMBREINSTITUCIONEDUCATIVA}</b>
                        <br>PROVINCIA:<b> ${colegio.PROVINCIA} </b>`+
                        `<br>NOMBRE DE LA SEDE:<b> ${colegio.NOMBRESEDEEDUCATIVA} </b>`+
                        `<br>ZONA:<b> ${colegio.ZONA} </b>`+
                        `<br>MUNICIPIO:<b> ${colegio.MUNICIPIO} </b>`+
                        `<br>CODIGO MUNICIPIO:<b> ${colegio.CODIGO_MUNICIPIO} </b>`+
                        `<br> CODIGO DANE DE INSTITUCION:<b> ${colegio.CODIGO_DANE_INSTITUCION_EDUCATIVA} </b>`+
                        `<br> COORDENADAS:<b>( ${colegio.LATITUD} , ${colegio.LONGITUD} ) </b> `);
                        
                        // Asegúrate de incluir la propiedad PROVINCIA
                        markers.push({ marker, name: colegio.NOMBREINSTITUCIONEDUCATIVA,NOMBRESEDEEDUCATIVA:colegio.NOMBRESEDEEDUCATIVA, PROVINCIA: colegio.PROVINCIA, ZONA: colegio.ZONA, MUNICIPIO: colegio.MUNICIPIO, CODIGO_MUNICIPIO: colegio.CODIGO_MUNICIPIO, CODIGO_DANE_INSTITUCION_EDUCATIVA: colegio.CODIGO_DANE_INSTITUCION_EDUCATIVA, LATITUD: colegio.LATITUD, LONGITUD: colegio.LONGITUD });
                    } else {
                        console.warn('Coordenadas no válidas para el colegio:', colegio);
                    }
                });
            })
            .catch(error => console.error('Error al cargar el archivo Excel:', error));

// Función de búsqueda

document.getElementById('searchFields').addEventListener('click', function (event) {
    if (event.target.tagName === 'BUTTON') {
        const searchType = document.getElementById('searchType').value;
        let searchText = '';

        if (searchType === 'nombre') {
            searchText = document.getElementById('searchInput').value.toLowerCase();
        } else if (searchType === 'provincia') {
            searchText = document.getElementById('searchInputProvincia').value.toLowerCase();
        } else if (searchType === 'nombreSede') {
            searchText = document.getElementById('searchInputnombreSede').value.toLowerCase();
        }else if (searchType === 'municipio') {
            searchText = document.getElementById('searchInputmunicipio').value.toLowerCase();
        }else if (searchType === 'codigomunicipio') {
            searchText = document.getElementById('searchInputcodigomunicipio').value;
        }else if (searchType === 'codigoDane') {
            searchText = document.getElementById('searchInputcodigoDane').value;
        }

        let found = false;

        markers.forEach(item => {
            if (searchType === 'nombre' && item.name && item.name.toLowerCase().includes(searchText)) {
                item.marker.setIcon(createCustomIcon("red"));
                map.setView(item.marker.getLatLng(), 15);
                item.marker.openPopup();
                found = true;
            } else if (searchType === 'provincia' && item.PROVINCIA && item.PROVINCIA.toLowerCase().includes(searchText)) {
                item.marker.setIcon(createCustomIcon("green"));
                map.setView(item.marker.getLatLng(), 15);
                item.marker.openPopup();
                found = true;
            }else if (searchType === 'nombreSede' && item.NOMBRESEDEEDUCATIVA && item.NOMBRESEDEEDUCATIVA.toLowerCase().includes(searchText)) {
                item.marker.setIcon(createCustomIcon("black"));
                map.setView(item.marker.getLatLng(), 15);
                item.marker.openPopup();
                found = true;
            } else if (searchType === 'municipio' && item.MUNICIPIO && item.MUNICIPIO.toLowerCase().includes(searchText)) {
                item.marker.setIcon(createCustomIcon("orange"));
                map.setView(item.marker.getLatLng(), 15);
                item.marker.openPopup();
                found = true;
            } else if (searchType === 'codigomunicipio' && item.CODIGO_MUNICIPIO) {
                const searchCode = searchText.trim(); // Eliminar espacios en blanco
                if (item.CODIGO_MUNICIPIO.toString() === searchCode) { // Comparar como cadena
                    item.marker.setIcon(createCustomIcon("green"));
                    map.setView(item.marker.getLatLng(), 15);
                    item.marker.openPopup();
                    found = true;
                }
            }
            else if (searchType === 'codigoDane' && item.CODIGO_DANE_INSTITUCION_EDUCATIVA) {
                const searchCode = searchText.trim(); // Eliminar espacios en blanco
                if (item.CODIGO_DANE_INSTITUCION_EDUCATIVA.toString() === searchCode) { // Comparar como cadena
                    item.marker.setIcon(createCustomIcon("red"));
                    map.setView(item.marker.getLatLng(), 15);
                    item.marker.openPopup();
                    found = true;
                }
            }else {
                item.marker.setIcon(createCustomIcon("blue"));
            }
        });

        if (!found) {
            let searchLabel = '';
            if (searchType === 'nombre') {
                searchLabel = 'institución';
            } else if (searchType === 'provincia') {
                searchLabel = 'provincia';
            } else if (searchType === 'nombreSede') {
                searchLabel = 'sede';
            }else if (searchType === 'municipio') {
                searchLabel = 'municipio';
            }else if (searchType === 'codigomunicipio') {
                searchLabel = 'codigo del municipio';
            }
            else if (searchType === 'codigoDane') {
                searchLabel = 'codigo DANE  de la institucion educativa';
            }
            alert(`No se encontró ninguna ${searchLabel} con ese nombre.`);
        }
    }
});

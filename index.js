const random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};


const key = (i) => {
    switch (i) {
        case 0: return "B"; break;
        case 1: return "I"; break;
        case 2: return "N"; break;
        case 3: return "G"; break;
        case 4: return "O"; break;
    }
}

const generateUniqueRandomNumbers = (min, max) => {
    return new Promise((resolve, reject) => {
        const numbers = [];

        const generateNumber = () => {
            const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
            if (!numbers.includes(randomNumber)) {
                numbers.push(randomNumber);
            }

            if (numbers.length < 5) {
                generateNumber();
            } else {
                resolve(numbers.sort((a, b) => a - b));
            }
        };

        if (max - min + 1 < 5) {
            reject(new Error('El rango especificado no es suficientemente grande para generar 5 números únicos.'));
        } else {
            generateNumber();
        }
    });
}


const generateBingoTable = async (codigo) => {
    return new Promise(async (resolve, reject) => {
        const table = [];
        let k = 0;
        for (let i = 0; i < 5; i++) {
            let data = {};
            data.letter = key(i);
            let numbers = [];
            switch (i) {
                case 0: numbers = await generateUniqueRandomNumbers(1, 15); break;
                case 1: numbers = await generateUniqueRandomNumbers(16, 30); break;
                case 2: {numbers = await generateUniqueRandomNumbers(31, 45); 
                        numbers[2]="";
                    break};
                case 3: numbers = await generateUniqueRandomNumbers(46, 60); break;
                case 4: numbers = await generateUniqueRandomNumbers(61, 75); break;
            }
            k++;
            data.codigo = codigo;
            data.values = [...numbers];
            table.push(data);
        }
        if (k === 5) {
            resolve(table)
        }
    })

};

const generateBingoTables = async (numberOfTables) => {
    return new Promise(async (resolve, reject) => {
        const tables = [];
        let k = 0;
        for (let i = 0; i < numberOfTables; i++) {
            const table = await generateBingoTable(i + 1);
            tables.push(table);
            k++;
        }

        if (k === numberOfTables) {
            console.log(k, ":", numberOfTables)
            resolve(tables);
        }
    })

};


// Crear la tabla utilizando fragments



const addLeadingZeros=(number, max)=> {
    const maxLength = String(max).length;
    const numberString = String(number);
    const zerosToAdd = maxLength - numberString.length;
  
    if (zerosToAdd <= 0) {
      return numberString;
    }
  
    const zeros = '0'.repeat(zerosToAdd);
    return zeros + numberString;
  }
  
const elTablas = document.querySelector(".tablas");

const generarTablasVisuales =  (tablas) => {
   

    let k = 0;
    tablas.forEach(tabla => {
        const fragment = document.createDocumentFragment();

        // Crear la tabla
        const table = document.createElement('table');
        const caption = document.createElement('caption');
        caption.textContent=addLeadingZeros(tabla[0].codigo,tablas.length)
        table.appendChild(caption)
    
        // Crear el thead
        const thead = document.createElement('thead');
        const trHead = document.createElement('tr');
        for (let i = 1; i <= 5; i++) {
            const th = document.createElement('th');
            th.textContent = key(i - 1);
            trHead.appendChild(th);
        }
        
        table.appendChild(thead);
        thead.appendChild(trHead);
    
        const tbody = document.createElement("tbody");
        let tr;
        let td;
        for (let i = 0; i <= 4; i++) {
            tr = document.createElement("tr");

            for (let j = 0; j <= 4; j++) {
                td = document.createElement("td");
                //     console.log(tabla[j].values[i]);
                td.textContent = tabla[j].values[i];
                k++;
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
        table.appendChild(tbody);
        fragment.appendChild(table);
        elTablas.appendChild(fragment);
    })
   

}

function filterUniqueObjects(array) {
    const checkUniqueArrays = (arr1, arr2) => {
      if (arr1.length !== arr2.length) {
        return false;
      }
  
      for (let i = 0; i < arr1.length; i++) {
        if (Array.isArray(arr1[i]) && Array.isArray(arr2[i])) {
          if (!checkUniqueArrays(arr1[i], arr2[i])) {
            return false;
          }
        } else if (arr1[i] !== arr2[i]) {
          return false;
        }
      }
  
      return true;
    };
  
    return array.filter((value, index) => {
      return array.findIndex((obj, i) => i !== index && checkUniqueArrays(obj, value)) === -1;
    });
  }
  

const main = async () => {
    console.log("1");
    const tables = await generateBingoTables(300);
    console.log("2");
    //const uniqueArr = tables.filter(obj => tables.indexOf(obj) === tables.lastIndexOf(obj));
    const uniqueArr=[...tables];
    const json = JSON.stringify(uniqueArr, null, 4);
    console.log(uniqueArr);
    const auo=[...filterUniqueObjects(uniqueArr)]
    console.log(auo);
    generarTablasVisuales(auo)
};

main();

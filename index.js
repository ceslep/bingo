const random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};


const key = (i) => {
    switch (i) {
        case 0: return "B";
        case 1: return "I";
        case 2: return "N";
        case 3: return "G";
        case 4: return "O";
    }
}

const generateUniqueRandomNumbers = (min, max) => {
    return new Promise((resolve, reject) => {
        const numbers = [];

        const generateNumber = () => {
            const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
            if (!numbers.includes(randomNumber))
                numbers.push(randomNumber);


            if (numbers.length < 5)
                generateNumber();
            else
                resolve(numbers.sort((a, b) => a - b));

        };

        if (max - min + 1 < 5)
            reject(new Error('El rango especificado no es suficientemente grande para generar 5 números únicos.'));
        else
            generateNumber();

    });
}


const generateBingoTable = async (codigo, length) => {
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
                case 2: {
                    numbers = await generateUniqueRandomNumbers(31, 45);
                    numbers[2] = addLeadingZeros(codigo, length);
                    break
                };
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
            const table = await generateBingoTable(i + 1, numberOfTables);
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



const addLeadingZeros = (number, max) => {
    const maxLength = String(max).length;
    const numberString = String(number);
    const zerosToAdd = maxLength - numberString.length;

    if (zerosToAdd <= 0)
        return numberString;


    const zeros = '0'.repeat(zerosToAdd);
    return zeros + numberString;
}



const generarTablasVisuales = (tablas) => {

    return new Promise((resolve, reject) => {
        let k = 0;
        const fragment = document.createDocumentFragment();
        tablas.forEach(tabla => {

            const table = document.createElement('table');
            table.classList.add("caption-top");
            const caption = document.createElement('caption');
            caption.classList.add("text-center");
            caption.textContent = addLeadingZeros(tabla[0].codigo, tablas.length)
            table.appendChild(caption)

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
                    td.textContent = tabla[j].values[i];
                    if (i === j && j == 2) td.classList.add("fw-bold", "rotated-text");
                    tr.appendChild(td);
                }
                tbody.appendChild(tr);
            }
            table.appendChild(tbody);
            fragment.appendChild(table);
            k++;
            if (k === tablas.length) resolve(fragment)

        })
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

const elTablas = document.querySelector(".tablas");

const main = async () => {
    console.log("1");
    const tables = await generateBingoTables(3000);
    const uniqueArr = [...tables];
    const aui = [...uniqueArr.map(u => u.map(a => a.values.map((b, i, a) => {
        a[2] = '0';
        return a
    })))];
    const abi=[...aui.map(a => a.join())]
    console.log(abi);
    const auo = [...filterUniqueObjects(uniqueArr)]
    console.table(abi.map(b=>b.split(",").reduce((a,b)=>a+b,'')).sort((a,b)=>a>b?1:-1));
    const fragment = await generarTablasVisuales(auo);
    elTablas.appendChild(fragment);
    console.log("2");
};

main();

/**
 * Logica JavaScript per l'Infografica di Death Note.
 *
 * Questo script si occupa di:
 * 1. Inizializzare i grafici utilizzando Chart.js.
 * 2. Fornire funzioni di utilità per i grafici (formattazione etichette, tooltip).
 * 3. Implementare lo scorrimento fluido per i link di navigazione interni.
 *
 * Dipendenze HTML:
 * - La libreria Chart.js deve essere inclusa nella pagina HTML.
 * - Devono esistere elementi <canvas> con i seguenti ID:
 * - tacticsChart
 * - ryukMotivationChart
 * - crimeRateChart
 * - kiraInfluenceChart
 * - La navigazione deve contenere link <a> con attributi href che iniziano con "#"
 * (es. <nav><a href="#sezione1">...</a></nav>) per il corretto funzionamento dello scorrimento fluido.
 *
 * I colori e i font sono definiti principalmente nel CSS dell'HTML originale
 * e qui vengono referenziati o sovrascritti specificamente per i grafici.
 */

// Funzione per mandare a capo le etichette lunghe nei grafici
const wrapLabel = (label, maxLength = 16) => {
    // Se l'etichetta non è una stringa, la restituisce così com'è
    if (typeof label !== 'string') return label;
    const words = label.split(' ');
    let currentLine = '';
    const lines = [];

    words.forEach(word => {
        // Controlla se aggiungendo la parola corrente si supera la lunghezza massima
        if ((currentLine + ' ' + word).trim().length > maxLength && currentLine.length > 0) {
            lines.push(currentLine.trim()); // Aggiunge la linea corrente all'array
            currentLine = word; // Inizia una nuova linea con la parola corrente
        } else {
            currentLine = (currentLine + ' ' + word).trim(); // Aggiunge la parola alla linea corrente
        }
    });
    // Aggiunge l'ultima linea rimasta
    if (currentLine.length > 0) {
        lines.push(currentLine.trim());
    }
    // Se l'etichetta è stata divisa in più linee, restituisce l'array, altrimenti l'etichetta originale
    return lines.length > 1 ? lines : label;
};

// Funzione per gestire i titoli dei tooltip (specialmente per etichette multi-linea)
const tooltipTitleCallback = (tooltipItems) => {
    const item = tooltipItems[0]; // Prende il primo elemento del tooltip (di solito ce n'è solo uno per il titolo)
    // Accede all'etichetta originale usando l'indice del dataset e l'indice del dato
    let label = item.chart.data.labels[item.dataIndex];
    // Se l'etichetta è un array (multi-linea), unisce gli elementi con uno spazio
    if (Array.isArray(label)) {
        return label.join(' ');
    }
    // Altrimenti, restituisce l'etichetta singola
    return label;
};

// Opzioni comuni per tutti i grafici Chart.js per mantenere uno stile coerente
const commonChartOptions = {
    responsive: true, // Rende il grafico responsivo al contenitore
    maintainAspectRatio: false, // Permette di controllare l'altezza indipendentemente dalla larghezza
    plugins: {
        legend: { // Configurazione della legenda
            labels: {
                color: '#D1D1D1', // Colore del testo della legenda (Grigio Chiaro)
                font: { size: 10, family: 'Lora' } // Font e dimensione per la legenda
            }
        },
        tooltip: { // Configurazione dei tooltip (messaggi al passaggio del mouse)
            callbacks: {
                title: tooltipTitleCallback // Usa la funzione personalizzata per il titolo del tooltip
            },
            backgroundColor: '#121212', // Sfondo del tooltip (Nero Vicino)
            titleColor: '#B08D57', // Colore del titolo del tooltip (Oro Sbiadito/Pergamena)
            bodyColor: '#D1D1D1', // Colore del corpo del tooltip (Grigio Chiaro)
            borderColor: '#8A0303', // Colore del bordo del tooltip (Rosso Sangue Intenso)
            borderWidth: 1,
            titleFont: { family: 'Cinzel' }, // Font per il titolo del tooltip
            bodyFont: { family: 'Lora' } // Font per il corpo del tooltip
        }
    },
    scales: { // Configurazione degli assi del grafico
        y: { // Asse Y
            beginAtZero: true, // Fa iniziare l'asse Y da zero
            ticks: { color: '#D1D1D1', font: { size: 10, family: 'Lora' } }, // Colore e font delle etichette dell'asse Y
            grid: { color: 'rgba(209,209,209,0.1)' } // Colore della griglia dell'asse Y
        },
        x: { // Asse X
            ticks: { color: '#D1D1D1', font: { size: 10, family: 'Lora' } }, // Colore e font delle etichette dell'asse X
            grid: { display: false } // Nasconde la griglia dell'asse X
        }
    }
};

// Dati e inizializzazione del Grafico delle Tattiche (Light vs. L)
const tacticsCtx = document.getElementById('tacticsChart');
if (tacticsCtx) {
    const tacticsData = {
        labels: ['Manipolazione', 'Sfruttamento Regole', 'Inganno', 'Deduzione Logica', 'Contenimento', 'Sacrificio Personale'].map(l => wrapLabel(l)),
        datasets: [
            {
                label: 'Light (Kira)',
                data: [90, 85, 70, 75, 30, 60],
                backgroundColor: '#8A0303', // Rosso Sangue Intenso
                borderColor: '#B08D57', // Oro Sbiadito/Pergamena
                borderWidth: 1
            },
            {
                label: 'L',
                data: [60, 70, 80, 95, 85, 50],
                backgroundColor: '#4A4A4A', // Grigio Medio
                borderColor: '#D1D1D1', // Grigio Chiaro
                borderWidth: 1
            }
        ]
    };
    new Chart(tacticsCtx, {
        type: 'bar', // Tipo di grafico: a barre
        data: tacticsData,
        options: {...commonChartOptions} // Applica le opzioni comuni
    });
} else {
    console.warn("Elemento canvas con ID 'tacticsChart' non trovato.");
}


// Dati e inizializzazione del Grafico delle Motivazioni di Ryuk
const ryukMotivationCtx = document.getElementById('ryukMotivationChart');
if (ryukMotivationCtx) {
    const ryukMotivationData = {
        labels: ['Noia/Divertimento', 'Interesse Materiale', 'Senso di Giustizia'].map(l => wrapLabel(l)),
        datasets: [{
            label: 'Motivazioni di Ryuk',
            data: [95, 0, 5], // Dati percentuali
            backgroundColor: ['#4A4A4A', '#B08D57', '#8A0303'], // Grigio, Oro, Rosso
            borderColor: '#121212', // Bordo Nero Vicino (per contrasto su sfondi chiari, se il grafico fosse isolato)
            borderWidth: 2
        }]
    };
    new Chart(ryukMotivationCtx, {
        type: 'doughnut', // Tipo di grafico: a ciambella
        data: ryukMotivationData,
        options: { // Opzioni specifiche per questo grafico (principalmente per la legenda)
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom', // Posizione della legenda
                    labels: { color: '#D1D1D1', font: {size: 10, family: 'Lora'} }
                },
                tooltip: { // Tooltip ereditano da commonChartOptions ma possono essere personalizzati
                    callbacks: {
                        title: tooltipTitleCallback
                    },
                    backgroundColor: '#121212',
                    titleColor: '#B08D57',
                    bodyColor: '#D1D1D1',
                    borderColor: '#8A0303',
                    borderWidth: 1,
                    titleFont: { family: 'Cinzel' },
                    bodyFont: { family: 'Lora' }
                }
            }
        }
    });
} else {
    console.warn("Elemento canvas con ID 'ryukMotivationChart' non trovato.");
}

// Dati e inizializzazione del Grafico del Tasso di Criminalità
const crimeRateCtx = document.getElementById('crimeRateChart');
if (crimeRateCtx) {
    const crimeRateData = {
        labels: ['Pre-Kira', 'Inizio Regno Kira', 'Picco Influenza Kira', 'Declino Kira', 'Post-Kira'].map(l => wrapLabel(l)),
        datasets: [{
            label: 'Tasso di Criminalità (Illustrativo)',
            data: [100, 70, 20, 40, 80], // Dati illustrativi
            fill: false, // Non riempire l'area sotto la linea
            borderColor: '#8A0303', // Rosso Sangue Intenso per la linea
            tension: 0.1, // Curvatura della linea
            pointBackgroundColor: '#8A0303', // Colore dei punti sulla linea
            pointBorderColor: '#B08D57' // Bordo dei punti
        }]
    };
    new Chart(crimeRateCtx, {
        type: 'line', // Tipo di grafico: a linee
        data: crimeRateData,
        options: {...commonChartOptions} // Applica le opzioni comuni
    });
} else {
    console.warn("Elemento canvas con ID 'crimeRateChart' non trovato.");
}

// Dati e inizializzazione del Grafico dell'Influenza di Kira
const kiraInfluenceCtx = document.getElementById('kiraInfluenceChart');
if (kiraInfluenceCtx) {
    const kiraInfluenceData = {
        labels: ['Anno 1', 'Anno 2', 'Anno 3', 'Anno 4', 'Anno 5', 'Anno 6'].map(l => wrapLabel(l)),
        datasets: [{
            label: 'Sfera d\'Influenza Globale di Kira (Stima)',
            data: [10, 30, 60, 85, 70, 50], // Dati percentuali illustrativi
            backgroundColor: 'rgba(138, 3, 3, 0.4)', // Rosso Sangue Intenso con trasparenza per l'area
            borderColor: '#8A0303', // Rosso Sangue Intenso per il bordo dell'area
            borderWidth: 2,
            fill: true, // Riempie l'area sotto la linea
            tension: 0.3, // Curvatura della linea
            pointBackgroundColor: '#8A0303', // Colore dei punti
            pointBorderColor: '#B08D57' // Bordo dei punti
        }]
    };
    new Chart(kiraInfluenceCtx, {
        type: 'line', // Tipo di grafico: a linee (usato per creare un grafico ad area con fill:true)
        data: kiraInfluenceData,
        options: { // Opzioni comuni con una leggera modifica per l'asse Y
            ...commonChartOptions,
            scales: {
                ...commonChartOptions.scales,
                y: {
                    ...commonChartOptions.scales.y,
                    suggestedMax: 100 // Suggerisce un massimo di 100 per l'asse Y (dato che sono percentuali)
                }
            }
        }
    });
} else {
    console.warn("Elemento canvas con ID 'kiraInfluenceChart' non trovato.");
}

// Logica per lo scorrimento fluido dei link di navigazione
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); // Previene il comportamento di default del link (salto immediato)

        const targetId = this.getAttribute('href'); // Ottiene l'ID della sezione target
        const targetElement = document.querySelector(targetId); // Trova l'elemento target

        if (targetElement) {
            // Calcola la posizione dell'elemento target, tenendo conto dell'altezza della barra di navigazione fissa
            const navSticky = document.querySelector('.nav-sticky');
            const navOffset = navSticky ? navSticky.offsetHeight : 0;
            const offsetTop = targetElement.offsetTop - navOffset;

            // Esegue lo scorrimento fluido verso l'elemento target
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth' // Abilita l'animazione di scorrimento
            });
        }
    });
});

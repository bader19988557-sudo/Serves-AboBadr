const STORAGE_KEY = 'abuBader_workshop_clean_v1';
const carForm = document.getElementById('carForm');
const carsList = document.getElementById('carsList');
const searchInput = document.getElementById('searchInput');
const carCount = document.getElementById('carCount');
const saveIndicator = document.getElementById('saveIndicator');

// تحميل البيانات المحفوظة مسبقاً
let cars = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cars));
    saveIndicator.textContent = 'تم الحفظ تلقائياً';
    saveIndicator.style.background = 'rgba(46, 204, 113, 0.2)';
    setTimeout(() => {
        saveIndicator.textContent = 'الحفظ التلقائي مفعل';
    }, 2000);
}

function getStatusClass(status) {
    if (status.includes('جاهزة')) return 'status-ready';
    if (status.includes('قطع')) return 'status-parts';
    return 'status-working';
}

function renderCars(filterText = '') {
    carsList.innerHTML = '';
    const filteredCars = cars.filter(car => 
        car.type.toLowerCase().includes(filterText.toLowerCase()) ||
        car.problem.toLowerCase().includes(filterText.toLowerCase())
    );

    carCount.textContent = filteredCars.length;

    if (filteredCars.length === 0) {
        carsList.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#a4b0be; padding: 30px;">لا توجد سيارات مسجلة حالياً</td></tr>`;
        return;
    }

    filteredCars.forEach((car) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong style="color: #2c3e50;">${car.type}</strong></td>
            <td>${car.problem}</td>
            <td style="color: #718093; font-size: 0.85rem;">${car.date}</td>
            <td><span class="status-pill ${getStatusClass(car.status)}">${car.status}</span></td>
            <td>
                <button class="action-btn btn-toggle" onclick="toggleStatus(${car.id})">تحديث الحالة</button>
                <button class="action-btn btn-delete" onclick="deleteCar(${car.id})">حذف</button>
            </td>
        `;
        carsList.appendChild(row);
    });
}

carForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const newCar = {
        id: Date.now(),
        type: document.getElementById('carType').value.trim(),
        problem: document.getElementById('problem').value.trim(),
        status: document.getElementById('status').value,
        date: new Date().toLocaleDateString('ar-SA')
    };

    cars.unshift(newCar);
    saveData();
    renderCars();
    carForm.reset();
});

function toggleStatus(id) {
    cars = cars.map(car => {
        if (car.id === id) {
            if (car.status === 'قيد العمل والفحص') car.status = 'بانتظار قطع الغيار';
            else if (car.status === 'بانتظار قطع الغيار') car.status = 'جاهزة للتسليم';
            else car.status = 'قيد العمل والفحص';
        }
        return car;
    });
    saveData();
    renderCars(searchInput.value);
}

function deleteCar(id) {
    if (confirm('هل تريد حذف هذا السجل؟')) {
        cars = cars.filter(car => car.id !== id);
        saveData();
        renderCars(searchInput.value);
    }
}

function exportData() {
    if (cars.length === 0) return alert('السجل فارغ!');
    let text = "--- سجل ورشة أبو بدر ---\n\n";
    cars.forEach((c, i) => {
        text += `${i+1}. نوع السيارة: ${c.type} | المشكلة: ${c.problem} | الحالة: ${c.status} | التاريخ: ${c.date}\n`;
    });
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `ورشة_أبو_بدر_${new Date().toLocaleDateString('en-CA')}.txt`;
    link.click();
}

searchInput.addEventListener('input', (e) => renderCars(e.target.value));

renderCars();
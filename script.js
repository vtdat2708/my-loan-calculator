const loanTableBody = document.getElementById("loanTableBody");
const totalPrincipalElement = document.getElementById("totalPrincipal");
const totalInterestElement = document.getElementById("totalInterest");

let totalPrincipal = 0;
let totalInterest = 0;

// Hàm để định dạng số tiền với dấu chấm phân cách
function formatCurrency(amount) {
    return amount.toLocaleString("vi-VN");
}

// Hàm để làm tròn tiền lãi đến nghìn
function roundToThousand(amount) {
    return Math.round(amount / 1000) * 1000;
}

// Hàm xử lý ngày trả mặc định là hôm nay
function setDefaultReturnDate() {
    const today = new Date().toISOString().split('T')[0]; // Lấy ngày hiện tại và chuyển sang định dạng YYYY-MM-DD
    document.getElementById("returnDate").value = today; // Cập nhật ngày trả mặc định
}

// Gọi hàm khi trang được tải để đảm bảo ngày trả mặc định là hôm nay
window.onload = function () {
    setDefaultReturnDate();
}

document.getElementById("addLoan").addEventListener("click", function () {
    const borrowDate = new Date(document.getElementById("borrowDate").value);
    let returnDate = document.getElementById("returnDate").value ? new Date(document.getElementById("returnDate").value) : new Date();

    // Nếu người dùng không nhập ngày trả, thì sử dụng ngày hôm nay
    if (!document.getElementById("returnDate").value) {
        returnDate = new Date();
    }

    const interestRate = parseFloat(document.getElementById("interestRate").value);
    
    // Chuyển đổi số tiền gốc (xóa dấu chấm và chuyển thành số)
    const principalAmount = parseFloat(document.getElementById("principalAmount").value.replace(/\./g, '').replace(/,/g, ''));

    // Kiểm tra dữ liệu
    if (isNaN(borrowDate) || isNaN(returnDate) || isNaN(interestRate) || isNaN(principalAmount)) {
        alert("Vui lòng nhập đầy đủ thông tin hợp lệ!");
        return;
    }

    const timeDifference = returnDate - borrowDate;
    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

    if (daysDifference < 0) {
        alert("Ngày trả phải lớn hơn hoặc bằng ngày vay!");
        return;
    }

    const interestPerDay = interestRate / 30 / 100;
    const totalInterestForLoan = daysDifference * interestPerDay * principalAmount;

    // Cập nhật tổng tiền lãi và tiền gốc
    totalPrincipal += principalAmount;
    totalInterest += totalInterestForLoan;

    // Làm tròn tiền lãi
    const roundedInterest = roundToThousand(totalInterestForLoan);

    const formattedPrincipal = formatCurrency(principalAmount);
    const formattedInterest = formatCurrency(roundedInterest);
    const formattedTotalPrincipal = formatCurrency(totalPrincipal);
    const formattedTotalInterest = formatCurrency(roundToThousand(totalInterest));

    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${borrowDate.toLocaleDateString("vi-VN")}</td>
        <td>${returnDate.toLocaleDateString("vi-VN")}</td>
        <td>${daysDifference}</td>
        <td>${formattedInterest} VND</td>
        <td>${formattedPrincipal} VND</td>
    `;

    loanTableBody.appendChild(row);

    totalPrincipalElement.textContent = `Tổng tiền gốc: ${formattedTotalPrincipal} VND`;
    totalInterestElement.textContent = `Tổng tiền lãi: ${formattedTotalInterest} VND`;
});

// Hàm xử lý nhập liệu số tiền gốc với dấu chấm phân cách
document.getElementById("principalAmount").addEventListener("input", function (event) {
    const input = event.target.value;
    // Xóa tất cả ký tự không phải số hoặc dấu chấm
    const formattedValue = input.replace(/[^0-9]/g, '').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    event.target.value = formattedValue;
});

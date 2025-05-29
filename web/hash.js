// Lưu WordArray thực vào đây (tránh dùng dataset vì nó chỉ lưu chuỗi)
const fileData = {
  input1: null,
  input2: null
};

function handleFileInput(event, targetId) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (e) {
    const arrayBuffer = e.target.result;
    const uint8Array = new Uint8Array(arrayBuffer);
    const wordArray = CryptoJS.lib.WordArray.create(uint8Array);

    // Lưu vào bộ nhớ tạm
    fileData[targetId] = wordArray;

    // Cập nhật ô nhập (hiển thị trạng thái)
    const input = document.getElementById(targetId);
    input.value = `[Đã tải file: ${file.name}]`;
    updateCharCount(targetId);
  };

  reader.readAsArrayBuffer(file);
}

function updateCharCount(id) {
  const value = document.getElementById(id).value;
  const length = value.startsWith("[Đã tải file") ? "[nhị phân]" : value.length;
  document.getElementById('count' + id.charAt(id.length - 1)).textContent = `${length} ký tự`;
}

function compareHash() {
  const input1Elem = document.getElementById("input1");
  const input2Elem = document.getElementById("input2");

  const isBinary1 = fileData.input1 !== null;
  const isBinary2 = fileData.input2 !== null;

  const data1 = isBinary1 ? fileData.input1 : input1Elem.value;
  const data2 = isBinary2 ? fileData.input2 : input2Elem.value;

  const hash256_1 = CryptoJS.SHA256(data1).toString();
  const hash256_2 = CryptoJS.SHA256(data2).toString();
  const hash512_1 = CryptoJS.SHA512(data1).toString();
  const hash512_2 = CryptoJS.SHA512(data2).toString();

  document.getElementById("hash256_1").textContent = hash256_1;
  document.getElementById("hash256_2").textContent = hash256_2;
  document.getElementById("hash512_1").textContent = hash512_1;
  document.getElementById("hash512_2").textContent = hash512_2;

  const result = (hash256_1 === hash256_2 && hash512_1 === hash512_2)
    ? "✅ Dữ liệu giống nhau (băm trùng khớp)."
    : "❌ Dữ liệu khác nhau (băm không khớp).";

  document.getElementById("compareResult").textContent = result;
}

// Lắng nghe nhập tay
document.getElementById('input1').addEventListener('input', () => {
  fileData.input1 = null;
  updateCharCount('input1');
});
document.getElementById('input2').addEventListener('input', () => {
  fileData.input2 = null;
  updateCharCount('input2');
});

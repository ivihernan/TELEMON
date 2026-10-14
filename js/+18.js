document.addEventListener("DOMContentLoaded", () => {
    const btn_si = document.getElementById("btn-si")
    const btn_no = document.getElementById("btn-no")
    const modal = document.getElementById('modal_18')

    btn_si.addEventListener("click", () => {

        modal.style.display = "none"
    })

    btn_no.addEventListener("click", () => {

        alert("No cumple la mayoría de edad, lo sentimos xd")
    })
})




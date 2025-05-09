document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("bishBoshForm");
    const resultDiv = document.getElementById("result");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const bish = parseInt(document.getElementById("bish").value);
        const bosh = parseInt(document.getElementById("bosh").value);
        const loopLimit = parseInt(document.getElementById("loopLimit").value);

        if (bish <= 0 || bosh <= 0 || loopLimit <= 0) {
            resultDiv.textContent = "Ange endast positiva heltal!";
            return;
        }

        let output = "";

        for (let i = 1; i <= loopLimit; i++) {
            if (i % bish === 0 && i % bosh === 0) {
                output += "Bish-Bosh";
            } else if (i % bish === 0) {
                output += "Bish";
            } else if (i % bosh === 0) {
                output += "Bosh";
            } else {
                output += i;
            }

            output += i < loopLimit ? "\n" : "";
        }

        resultDiv.textContent = output;
    });
});
async function checkRepetition(complementExpandable) { 
    const chooserDiv = complementExpandable.querySelector('.chooser-select.w-20');
    let plusButton = complementExpandable.querySelector("[data-testid='btn-plus']");
    if(plusButton){
    plusButton.click(); 
    plusButton.click();
    await this.sleep(200)
    const counter = chooserDiv.querySelector('.px-2.font-3.row-center');
    const counterValue = parseInt(counter.textContent, 10);
    if (counterValue > 1) {
        return "com repeticao";
      } 
    else if (counterValue === 1) {
        return "sem repeticao";
      }
    }else{
      return "sem repeticao";
    }
}
class scrapyCardapioWeb {
  constructor() {
    this.scrapedData = [];
    this.titleRestaurant = ""
  }

  sleep(ms) {     return new Promise(resolve => setTimeout(resolve, ms)); }

 
  

  async checkRepetition(complementExpandable) { 
    let button = complementExpandable.querySelector(".MuiSvgIcon-root");
    if (button) {
      return "com repeticao";
    } else {
      return "sem repeticao";
    }
}


  async processTypeComplement(typeComplement, complementExpandable) {
    const complement = typeComplement.trim();
    let repetition = await this.checkRepetition(complementExpandable);
    let type = "";
    let minQtd = 0;
    let maxQtd = 0;
  
     if (complement.match(/^Escolha até (\d+) opções/)) {
      const maxItems = parseInt(complement.match(/^Escolha até (\d+) opções/)[1], 10);
      type = 'Mais de uma opcao ' + repetition;
      maxQtd = maxItems;
      console.log('minQtd:', minQtd, 'maxQtd:', maxQtd);
    
    }else if (complement =="Escolha 1 opção") {
      type = 'Apenas uma opcao';
      maxQtd = 1;
      minQtd = 1;
      console.log('minQtd:', minQtd, 'maxQtd:', maxQtd);
    }else if (complement == "Escolha até 1 opção") {
      type = 'Apenas uma opcao ';
      maxQtd = 1;
      minQtd = 0;
      console.log('minQtd:', minQtd, 'maxQtd:', maxQtd);
    }else if (complement.match(/^Escolha de \d+ a \d+ opções$/)) {
      const minMaxItems = complement.match(/\d+/g);
      const minItems = parseInt(minMaxItems[0], 10);
      const maxItems = parseInt(minMaxItems[1], 10);
      type = 'Mais de uma opcao ' + repetition;
      minQtd = minItems;
      maxQtd = maxItems;
      console.log('minQtd:', minQtd, 'maxQtd:', maxQtd);
    }
    return [type, minQtd, maxQtd];
  }

  async clickProductCards() {
    console.log("executando..");
    await this.sleep(1000);
    let categoryDivs = document.querySelectorAll('.px-2.mt-8');

    for await (const categoryIndex of [...Array(categoryDivs.length).keys()]) {
        let categoryDivs = document.querySelectorAll('.px-2.mt-8');
        let categoryDiv = categoryDivs[categoryIndex];
        let categoryNameElement = categoryDiv.querySelector('.mb-3');
        let categoryName = categoryNameElement ? categoryNameElement.textContent : "";
        console.log(categoryName);
        let productCards = categoryDiv.querySelectorAll('[data-key="h-product-card"]');
      console.log(productCards)
        let productData = [];
        let complementsDict;
        for await (const productIndex of [...Array(productCards.length).keys()]) {
            let categoryDivs = document.querySelectorAll('.px-2.mt-8');
            let categoryDiv = categoryDivs[categoryIndex];
            let productCards = categoryDiv.querySelectorAll('[data-key="h-product-card"]');
            let productExhausteds = categoryDiv.querySelectorAll('.absolute.top-0.right-0.overflow-hidden')
            let productCard = productCards[productIndex];
            let productExhausted = productExhausteds[productIndex];
            await this.sleep(500);
           if(productExhausted){
            continue;
           }
            productCard.click();
            await this.sleep(500);

            let productContainer = document.querySelector('.relative.flex.flex-col.min-h-full.w-full');
            let productContainer2 = document.querySelector('.flex.items-center.p-5');
            let titleElement = productContainer.querySelector('.text-base.font-medium.leading-6.text-gray-700');
            let priceElement = productContainer.querySelector('.mt-3.text-base.text-gray-700, .text-sm.text-gray-500.line-through');
            let promoPriceElement = productContainer.querySelector('.text-base.text-green-500');
            let imgElement = productContainer2 ? productContainer2.querySelector('img.bg-gray-100') : null;
            let descricaoElement = productContainer.querySelector('.text-sm.font-light.text-gray-500 ');
            let productTitle = titleElement ? titleElement.textContent : "";
            console.log(productTitle)
            let promoPriceText = promoPriceElement ? promoPriceElement.textContent : "";
            let priceText = priceElement ? priceElement.textContent : "";
            let productPrice = 0; 
              if (priceText.includes("A partir de")) {
                  productPrice = 0;
              } else {
                  // Caso contrário, extrai o valor numérico e ajusta a vírgula
                  productPrice = priceText.replace(/[^\d,.]/g, '').replace('.', ',');
                }
            let productPromoPrice = promoPriceText.replace(/[^\d,.]/g, '').replace('.', ',');
            let imgSrc = imgElement ? imgElement.src : "";
            let productDescricao = descricaoElement ? descricaoElement.textContent : "";

            complementsDict = [];
          await this.sleep(2000)
          let complementExpandables = document.querySelectorAll('[class="p-0"]');
          
          for await (const complementExpandable of complementExpandables) {
            let complementElements = complementExpandable.querySelectorAll('.MuiListSubheader-root.p-4.text-gray-700.bg-gray-100 ');
            
            
            let optionsComplement = [];
  
            // Pegar o nome de cada complemento
            for await (const complementElement of complementElements) {
              let typeComplementElement = complementElement.querySelector('.text-xs.font-light');
              let complementNameElement = complementElement.querySelector('.text-sm.font-medium');
              let requiredElement = complementElement.querySelector('.p-1.font-normal.leading-3.text-white');
              let typeComplementText = typeComplementElement ? typeComplementElement.textContent : "";

              let [typeComplement, minQtd, maxQtd] = await this.processTypeComplement(typeComplementText, complementExpandable)
              let required = requiredElement ? requiredElement.textContent : "";
              let complementName = complementNameElement ? complementNameElement.textContent : "";
              // Pegar nome de cada opção do complemento da iteração
              

              let optionsElement = complementExpandable.querySelectorAll('.flex.items-center.justify-between ');
              
              for await (const optionElement of optionsElement) {
                if (optionElement != complementExpandable.querySelector('div.flex.items-center.justify-between.space-x-2')){
                  
                
                  let optionTitleElement = optionElement.querySelector('.flex.items-center.text-sm ');
                  let optionPriceElement = optionElement.querySelector('.mt-1.text-xs.font-medium ');
                  let optionDescriptionElement = optionElement.querySelector('.text-xs.font-light.text-gray-700');
                  let optionImgELement = optionElement.querySelector('img.bg-gray-100.object-contain.object-center.w-full.h-full.block');
                  //let optionQtdElement = optionElement.querySelector('span.text-grey-3');
    
                  let optionTitle = optionTitleElement ? optionTitleElement.textContent : "";
                  let optionDescription = optionDescriptionElement ? optionDescriptionElement.textContent : "";
                  let optionPriceText = optionPriceElement ? optionPriceElement.textContent : "0";
                  let optionPrice = optionPriceText.replace(/[^\d,.]/g, '').replace('.', ',');
                  let optionImg = optionImgELement ? optionImgELement.src : "";
                  //let optionQtd = optionQtdElement ? optionQtdElement.textContent : "";
                  
                  
                  optionsComplement.push({
                    optionTitle: optionTitle,
                    optionPrice: optionPrice,
                    optionDescription: optionDescription,
                    optionImg: optionImg
                  });
                }
              }
  
              complementsDict.push({
                nameComplement: complementName,
                typeComplement: typeComplement,
                minQtd: minQtd,
                maxQtd: maxQtd,
                required: required,
                options: optionsComplement
              })
              console.log("- - - - - - - - - - - - - - - - - ")
              console.log("NOME DO COMPLEMENTO: ",complementName)
              console.log("TEXTO DO TIPO DO COMPLEMENTO: ",typeComplementText.trim())
              console.log("TIPO DO COMPLEMENT: ",typeComplement)
              console.log("QUANTIDADE MIN: ",minQtd)
              console.log("QUANTIDADE MAX: ",maxQtd)
              console.log("REQUERED: ",required)
              console.log("OPÇOES: ",optionsComplement)
              console.log("- - - - - - - - - - - - - - - - - ")
              console.log("                                  ")
            }
          }
          
          productData.push({
            title: productTitle,
            price: productPrice,
            promoPrice : productPromoPrice,
            imgSrc: imgSrc,
            descricao: productDescricao,
            complementsDict: complementsDict
          });
          console.log("- - - - - - - - - - - - - - - - - ")
          console.log("NOME PRODUTO: ", productTitle)
          console.log("PREÇO PRODUTO: ", productPrice)
          console.log("IMAGEM: ", imgSrc)
          console.log("DESCRIÇAO: ", productDescricao)
          console.log("- - - - - - - - - - - - - - - - - ")
          console.log("                                  ")
          await this.backPage();
          await this.sleep(1000)
          
      }
      this.scrapedData.push({
        categoryName: categoryName,
        productsCategory: productData
      });
      //await this.backPage(); 
    }
    //alert("Finalizado!")
}


async backPage() {
  await this.sleep(1000);
  let back = document.querySelector('.MuiButtonBase-root.MuiIconButton-root.z-20.text-2xl.text-gray-500')
  if (back) {
    console.log("Voltou")
    back.click()
}
}
}

function desativarAlerta() {
  const alertContainer = document.querySelector('[data-testid="alert-container"]');
  if (alertContainer) {
    alertContainer.remove();
  }
}
// Chame a função desativarAlerta antes de executar outras ações
desativarAlerta();

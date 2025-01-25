//Feito por Alexandre

class scrapyHubt {
    constructor() {
      this.scrapedData = [];
      this.titleRestaurant = ""
    }
  
  sleep(ms) {return new Promise(resolve => setTimeout(resolve, ms)); }
  
  async checkRepetition(complementExpandable) {
        if(complementExpandable){
        return { repetition: "sem repeticao" };
        }
}

        async processTypeComplement(typeComplement,complementExpandable) {
            console.log('typeComplement:', typeComplement);
            let type = "" ;
            let minQtd = 0;
            let maxQtd = 0;

            if(!typeComplement == ""){
            let { repetition } = await this.checkRepetition(complementExpandable);
            console.log('repetition:', repetition);
            type = "Apenas uma opcao ";
            minQtd = 1;
            maxQtd = 1;
      
            }
            return [type, minQtd, maxQtd];
        }

    async clickProductCards() {
      console.log("executando..")

      let titleElement = document.title || '';
      let titleSplit = titleElement.split('-');
      this.titleRestaurant = titleSplit[0].trim() || '';

      await this.sleep(1000)
      let categoryDivs = document.querySelectorAll('.cardapio-module');
    
      for await (const categoryIndex of [...Array(categoryDivs.length).keys()]) {
        await this.sleep(500)
        let categoryDivs = document.querySelectorAll('.cardapio-module');
        let categoryDiv = categoryDivs[categoryIndex];
        let categoryNameElement = categoryDiv.querySelector('.module-title');
        let categoryName = categoryNameElement ? categoryNameElement.textContent : "";
        console.log("NOME DA CATEGORIA: ", categoryName)
        let productCards = categoryDiv.querySelectorAll(".ProductModule__ItemContainer-sc-1kmcc3y-0");
    
        let productData = [];
        for await (const productIndex of [...Array(productCards.length).keys()]) {
          await this.sleep(1000)
          let categoryDivs = document.querySelectorAll('.cardapio-module');
          let categoryDiv = categoryDivs[categoryIndex];
          let productCards = categoryDiv.querySelectorAll((".ProductModule__ItemContainer-sc-1kmcc3y-0"));
          let productCard = productCards[productIndex];
          
  
            await this.sleep(500);
            productCard.scrollIntoView();
            productCard.click();
            await this.sleep(1000);

            let productModal = document.querySelector('.sc-fzplWN.hRBsWH.sc-fzpjYC');
            let complementElement = document.querySelector('.ProductItemDialog__PriceList-j5dr03-5.hLOrDr');
            let notComplementElement = document.querySelector('.price-Único');
            let titleElement = productModal.querySelector('.ProductItemDialog__DialogProductTitle-j5dr03-0');
            let imgElement = document.querySelector('.MultiImagesEditor__ProductHeaderImage-awskso-4');
            let imageUrl = imgElement ? window.getComputedStyle(imgElement).backgroundImage.replace(/^url\(["'](.+)["']\)$/, '$1') : null;
            let descricaoElement = productModal.querySelector('.ProductItemDialog__ProductDescription-j5dr03-2.bxZGzY');
            let productTitle = titleElement ? titleElement.textContent : "";
            let imgSrc = imageUrl ? imageUrl : "";
            let productDescricao = descricaoElement ? descricaoElement.innerHTML.replace(/<br\s*\/?>/gi, '\n\n') : "";
            let productPrice = "";
            let notComplement = "";

            if(notComplementElement){
            notComplement = notComplementElement.textContent
            
            let priceElement = "";

            if(complementElement){
            priceElement = productModal.querySelector('.ProductItemDialog__ProductPriceStyled-j5dr03-7.jHqzxF');
            }

            
            let priceText = priceElement ? priceElement.textContent : "";
            productPrice = priceText.replace(/[^\d,.]/g, '').replace('.', ',')
          }

            let complementsDict = []
            
            let complementExpandables = document.querySelectorAll('.ProductItemDialog__PriceList-j5dr03-5');

            for await (const complementExpandable of complementExpandables) {

              let optionsComplement = [];
              
                let required = "";
                let complementName = "Escolha um Complemento";
                let typeComplementText = "";

                if(notComplement !== 'Único'){
                typeComplementText =  "Escolha um complemento";
                }
                let [typeComplement, minQtd, maxQtd] = await this.processTypeComplement(typeComplementText, complementExpandable)
                // Pegar nome de cada opção do complemento da iteração
                
                let optionsElement = complementExpandable.querySelectorAll('.ProductItemDialog__PriceItem-j5dr03-6');
                for await (const optionElement of optionsElement) {


                  let optionTitle = "";
                  let optionPrice = "";
                  let optionDescription = "";

                  if(!productModal.querySelector('.price-Único')){
                  let optionTitleElement = optionElement.querySelector('span.price-description');
                  let optionPriceElement = optionElement.querySelector('.ProductItemDialog__ProductPriceStyled-j5dr03-7.jHqzxF');
                  
    
                  optionTitle = optionTitleElement ? optionTitleElement.textContent : "";
                  let optionPriceText = optionPriceElement ? optionPriceElement.textContent : "0";
                  optionPrice = optionPriceText.replace(/[^\d,.]/g, '').replace('.', ',');
                  //let optionQtd = optionQtdElement ? optionQtdElement.textContent : "";
                  let optionDescription = "";
                  }
                  optionsComplement.push({
                    optionTitle: optionTitle,
                    optionPrice: optionPrice,
                    optionDescription: optionDescription
                  });
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
    
            productData.push({
              title: productTitle,
              price: productPrice,
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
          
        }
        this.scrapedData.push({
          categoryName: categoryName,
          productsCategory: productData
        });
        
        await this.backPage();
      }
      //alert("Finalizado!")
  }
  
  
  async backPage() {
    await this.sleep(1000);
    let back = document.querySelector('.sc-AxirZ.sc-fzokOt.DAMdR')
    if (back) {
      back.click()
  }}
  }
  
 
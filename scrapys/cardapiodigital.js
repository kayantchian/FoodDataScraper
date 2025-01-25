
class scrapyCardapioDigital {
    constructor() {
      this.scrapedData = [];
      this.titleRestaurant = ""
    }
  
    sleep(ms) {     return new Promise(resolve => setTimeout(resolve, ms)); }
  
    async checkRepetition(complementExpandable){
        let repetition
        let chooserDiv = complementExpandable.querySelector('.sc-caXVBt.pzWYu')
        if(chooserDiv){
          repetition = " com repeticao"
        }
        else{
          repetition = " sem repeticao"
        }
        return repetition
    }


    async processTypeComplement(complementExpandable) {
      
        var typeOption = complementExpandable.querySelector('.sc-fLlhyt.cNWLEt.sc-ecbf8c8a-0');
        var typeText = typeOption ? typeOption.textContent.trim() : "";
        var minQtd, maxQtd
        var required = complementExpandable.querySelector('.sc-fLlhyt.cNWLEt.sc-ecbf8c8a-0.sc-2815c808-5');
      
        var regex = /(\d+)\s+de\s+(\d+)/;
        var match = typeText.match(regex);
        var type
        var repetition = await this.checkRepetition(complementExpandable)

        // Atribua os valores a minQtd e maxQtd, ou 0 se não houver correspondência
        minQtd = match ? parseInt(match[1], 10) : 0;
        maxQtd = match ? parseInt(match[2], 10) : 0;
      
        // Verifique se 'required' existe e tem o texto "Obrigatório"
        if (required && required.textContent.trim() === "Obrigatório") {
          minQtd = 1;
        }
      
        console.log({ minQtd, maxQtd });

        if(maxQtd>1){
            type = "Mais de uma opcao" + repetition
        }
        else{
            type = "Apenas uma opcao"
        }

        return [type, minQtd, maxQtd]
      }
  
      async extractPrice(priceText) {
        if (priceText.toLowerCase().includes('a partir de')) {
          return 0; // Retorna 0 se a expressão for encontrada
        } else {
          const matches = priceText.match(/[\d,]+/);
      
          if (matches && matches.length > 0) {
            // Verifica se há correspondências antes de acessar a posição 0
            const price = parseFloat(matches[0].replace('.', ','));
            return price;
          } else {
            return 0; // Retorna 0 se nenhuma correspondência for encontrada
          }
        }
      }
      
  
    async clickProductCards() {
  
      this.titleRestaurant = document.title || '';
  
      console.log("executando..")
      await this.sleep(500)
      let categoryDivs = document.querySelectorAll('.sc-7aaae754-1')
    
      for await (const categoryIndex of [...Array(categoryDivs.length).keys()]) {
        await this.sleep(500)
        let categoryDivs = document.querySelectorAll('.sc-7aaae754-1')
        let categoryDiv = categoryDivs[categoryIndex];
        let categoryNameElement = categoryDiv.querySelector('.sc-gKXOVf')
        let categoryName = categoryNameElement ? categoryNameElement.textContent : "";
    
  
        let productCards = categoryDiv.querySelectorAll('.sc-de312e94-3, .sc-77dfba53-0.jMrGpH');
        console.log(categoryName);
        console.log(productCards);
        
        let productData = [];
        for await (const productIndex of [...Array(productCards.length).keys()]) {
          await this.sleep(500);
          let categoryDivs = document.querySelectorAll('.sc-7aaae754-1');
          let categoryDiv = categoryDivs[categoryIndex];
          let productCards = categoryDiv.querySelectorAll('.sc-de312e94-3, .sc-77dfba53-0.jMrGpH');

          let productCard = productCards[productIndex];
          
          console.log({productIndex, productCard})
  
            let priceElement = productCard.querySelector('.sc-fLlhyt.bNJFxQ, .sc-fLlhyt.fERYBh')
          
            productCard.scrollIntoView();
            await this.sleep(500)
            productCard.click();
              
              // Agora, vamos adicionar um atraso antes de coletar os dados.
            await this.sleep(1000)
            let productModal = document.querySelector('.sc-himrzO');
            let titleElement = productModal.querySelector('.sc-gKXOVf.itJyZm');
            console.log(titleElement)
            let imgElement = productModal.querySelector('.sc-29a74f8b-8');
            let descricaoElement = productModal.querySelector('.sc-fLlhyt.isejHB')
            let productTitle = titleElement ? titleElement.textContent : "";
            console.log(productTitle)
            let priceText = priceElement ? priceElement.textContent : "";
            let productPrice = await this.extractPrice(priceText);  
            let imgSrc = imgElement ? imgElement.src : "";
            let productDescricao = descricaoElement ? descricaoElement.textContent : "";
    
            let complementsDict = []
            let complementExpandables = productModal.querySelectorAll('.sc-bczRLJ.sc-f719e9b0-0.sc-2815c808-0')
            for await (const complementExpandable of complementExpandables) {
              let complementElements = complementExpandable.querySelectorAll('.sc-bczRLJ.sc-f719e9b0-0.sc-2815c808-1')
              let optionsComplement = [];
              // Pegar o nome de cada complemento
              for await (const complementElement of complementElements) {
                let complementNameElement = complementElement.querySelector('h3.sc-gKXOVf.hyVdID')
                let complementName = complementNameElement ? complementNameElement.textContent : "";
                
                let [typeComplement, minQtd, maxQtd] = await this.processTypeComplement(complementExpandable);
                console.log([typeComplement, minQtd, maxQtd])
                
                // Pegar nome de cada opção do complemento da iteração
                let optionsElement = complementExpandable.querySelectorAll('.sc-bczRLJ.sc-f719e9b0-0.sc-d41a80ea-0.leULZP')
                for await (const optionElement of optionsElement) {
                  let optionTitleElement = optionElement.querySelector('.sc-jfmDQi.sc-d41a80ea-2.kzllVI.igyqSS')
                  let optionPriceElement = optionElement.querySelector('.sc-fLlhyt.cNWLEt.sc-ecbf8c8a-0.sc-d41a80ea-3.sc-d41a80ea-4')
                  let optionDescriptionElement = optionElement.querySelector('.sc-fLlhyt.cNWLEt.sc-ecbf8c8a-0.sc-d41a80ea-3')
                  let optionImgElement = optionElement.querySelector('.sc-d41a80ea-6');

                  let optionTitle = optionTitleElement ? optionTitleElement.textContent : "";
                  let optionPriceText = optionPriceElement ? optionPriceElement.textContent : "0";
                  let optionPrice = optionPriceText.replace(/[^\d,.]/g, '').replace('.', ',')
                  let optionDescription = optionDescriptionElement ? optionDescriptionElement.textContent : "";
                  let optionImgNotUrl = optionImgElement ? window.getComputedStyle(optionImgElement).getPropertyValue('background-image') : "";
                  let optionImg = optionImgNotUrl ? optionImgNotUrl.replace('url("', '').replace('")', '') : "";

                  optionsComplement.push({
                    optionTitle: optionTitle,
                    optionPrice: optionPrice,
                    optionDescription: optionDescription,
                    optionImg: optionImg
                  });
                }
    
                complementsDict.push({
                  nameComplement: complementName,
                  typeComplement: typeComplement,
                  minQtd: minQtd,
                  maxQtd: maxQtd,
                  options: optionsComplement
                })
                console.log("- - - - - - - - - - - - - - - - - ")
                console.log("NOME DO COMPLEMENTO: ",complementName)
                console.log("TIPO DO COMPLEMENT: ",typeComplement)
                console.log("QUANTIDADE MIN: ",minQtd)
                console.log("QUANTIDADE MAX: ",maxQtd)
                console.log("OPÇOES: ",optionsComplement)
                console.log("- - - - - - - - - - - - - - - - - ")
                console.log("                                  ")

              }
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
        console.log("Categoria adicionada")
      }
  }
  
  
  async backPage() {
    console.log("Voltou!")
    await this.sleep(1000);
    let productModal = document.querySelector('.sc-himrzO');
    let back = productModal.querySelector('button[aria-label="Fechar"]');
    if (back) {
      back.click()
  }
    await this.sleep(1000);
  }
  }
  
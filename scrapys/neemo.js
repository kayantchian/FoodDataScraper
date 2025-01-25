
class scrapyNeemo {
    constructor() {
      this.scrapedData = [];
      this.titleRestaurant = ""
    }
  
    sleep(ms) {     return new Promise(resolve => setTimeout(resolve, ms)); }
  
    async checkRepetition(complementExpandable){
        let repetition
        let chooserDiv = complementExpandable.querySelector('.icon-add.MuiBox-root.css-1at7nq9')
        if(chooserDiv){
          repetition = "com repeticao"
        }
        else{
          repetition = "sem repeticao"
        }
        return repetition
    }


    async processTypeComplement(typeComplement, complementExpandable, required) {
      const complement = typeComplement.trim();
      let repetition = await this.checkRepetition(complementExpandable);
      let type = "Apenas uma opcao";
      let minQtd = 0;
      let maxQtd = 1;

      if(required === "Obrigatório"){
        minQtd = 1
      }
    
       if (complement.match(/^Escolha até (\d+) opções/)) {
        const maxItems = parseInt(complement.match(/^Escolha até (\d+) opções/)[1], 10);
        type = 'Mais de uma opcao ' + repetition;
        maxQtd = maxItems;
        console.log('minQtd:', minQtd, 'maxQtd:', maxQtd);
      
      }else if (complement =="Escolha 1 opção") {
        type = 'Apenas uma opcao';
        maxQtd = 1;
        console.log('minQtd:', minQtd, 'maxQtd:', maxQtd);
      }else if (complement.match(/^Escolha (\d+) opções/)) {
        const maxItems = parseInt(complement.match(/^Escolha (\d+) opções/)[1], 10);
        type = 'Mais de uma opcao ' + repetition;
        maxQtd = maxItems;
          if(required === "Obrigatório"){
            minQtd = maxItems
          }
        console.log('minQtd:', minQtd, 'maxQtd:', maxQtd);
      }else if (complement.match(/^Escolha entre \d+ e \d+ opções$/)) {
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
  
      this.titleRestaurant = document.title || '';
  
      console.log("executando..")
      await this.sleep(500)
      let categoryDivs = document.querySelectorAll('.MuiBox-root.css-c6ss3g')
    
      for await (const categoryIndex of [...Array(categoryDivs.length).keys()]) {
        await this.sleep(500)
        let categoryDivs = document.querySelectorAll('.MuiBox-root.css-c6ss3g')
        let categoryDiv = categoryDivs[categoryIndex];
        let categoryNameElement = categoryDiv.querySelector('.MuiBox-root.css-q9sswo');
        let categoryName = categoryNameElement ? categoryNameElement.textContent : "";
        
        let productCards = categoryDiv.querySelectorAll('.MuiBox-root.css-8n1saz, .MuiBox-root.css-1fi2p6v');
        console.log(categoryName);
        console.log(productCards);
        
        let productData = [];
        for await (const productIndex of [...Array(productCards.length).keys()]) {
          await this.sleep(500);
          let categoryDivs = document.querySelectorAll('.MuiBox-root.css-c6ss3g')
          let categoryDiv = categoryDivs[categoryIndex];
          let productCards = categoryDiv.querySelectorAll('.MuiBox-root.css-8n1saz, .MuiBox-root.css-1fi2p6v');
          let productCard = productCards[productIndex];
          
          console.log({productIndex, productCard})
  
          
          productCard.scrollIntoView();
          await this.sleep(500)
          productCard.click();
              
              // Agora, vamos adicionar um atraso antes de coletar os dados.
              await this.sleep(1000)
              let productModal = document.querySelector('.MuiBox-root.css-1bng0u7, .MuiBox-root.css-1kx78zm');
              let titleElement = productModal.querySelector('.css-1jwx12t');
              let priceElement = productModal.querySelector('.css-14wep3p')
              console.log(titleElement)
              
              let img = productModal.querySelector('img')
              let imgElement = ""
              let imgSrc = "";

            if(img){
              imgElement = productModal.querySelector('img');
              imgSrc = imgElement ? imgElement.src : ""
            }else{
              imgElement = productModal.querySelector('.MuiBox-root');
              imgSrc = imgElement.getAttribute('url') || "";

            }



            let descricaoElement = productModal.querySelector('.css-1ewlikw, .css-13c8hy8')
            let productTitle = titleElement ? titleElement.textContent : "";
            console.log(productTitle)
            let priceText = priceElement ? priceElement.textContent : "";
            let productPrice = 0 
            if (priceText.includes("A partir de")) {
              productPrice = 0;
          } else {
              // Caso contrário, extrai o valor numérico e ajusta a vírgula
              productPrice = priceText.replace(/[^\d,.]/g, '').replace('.', ',');
            }

            let productDescricao = descricaoElement ? descricaoElement.textContent : "";
    
            let complementsDict = []
            let complementExpandables = productModal.querySelectorAll('.MuiBox-root.css-qsaw8')
            for await (const complementExpandable of complementExpandables) {
              let complementElements = complementExpandable.querySelectorAll('.MuiBox-root.css-7tvi6m')
              let optionsComplement = [];
              // Pegar o nome de cada complemento
              for await (const complementElement of complementElements) {
              let typeComplementElement = complementElement.querySelector('.MuiTypography-root.MuiTypography-body1.css-7nc1ma');
              let complementNameElement = complementElement.querySelector('.css-14wep3p');
              let requiredElement = complementElement.querySelector('.MuiBox-root.css-1h5deg2');
              let typeComplementText = typeComplementElement ? typeComplementElement.textContent : "";
              let required = requiredElement ? requiredElement.textContent : "";

              let [typeComplement, minQtd, maxQtd] = await this.processTypeComplement(typeComplementText, complementExpandable, required)
              let complementName = complementNameElement ? complementNameElement.textContent : "";
                
                // Pegar nome de cada opção do complemento da iteração
                let optionsElement = complementExpandable.querySelectorAll('.MuiBox-root.css-1dz7oz6, .MuiBox-root.css-ax65wm, .MuiBox-root.css-1yuo84k ')
                for await (const optionElement of optionsElement) {
                  let optionTitleElement = optionElement.querySelector('.MuiTypography-root.MuiTypography-body1.css-13so3bl, .MuiBox-root.css-1yuo84k')  
                  let optionPriceElement = optionElement.querySelector('.css-1ku18k1')
                  let optionDescriptionElement = optionElement.querySelector('.MuiTypography-root.MuiTypography-body1.dark.css-16542y8')
                  // let optionImgElement = optionElement.querySelector('.sc-d41a80ea-6');

                  let optionTitle = optionTitleElement ? optionTitleElement.textContent : "";
                  let optionPriceText = optionPriceElement ? optionPriceElement.textContent : "0";
                  let optionPrice = optionPriceText.replace(/[^\d,.]/g, '').replace('.', ',')
                  let optionDescription = optionDescriptionElement ? optionDescriptionElement.textContent : "";
                  // let optionImgNotUrl = optionImgElement ? window.getComputedStyle(optionImgElement).getPropertyValue('background-image') : "";
                  // let optionImg = optionImgNotUrl ? optionImgNotUrl.replace('url("', '').replace('")', '') : "";

                  optionsComplement.push({
                    optionTitle: optionTitle,
                    optionPrice: optionPrice,
                    optionDescription: optionDescription,
                    // optionImg: optionImg
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
    let productModal = document.querySelector('.MuiBox-root.css-1bng0u7, .MuiBox-root.css-1kx78zm');
    let back = productModal.querySelector('.MuiBox-root.css-1cs9e5v, .icon-close.MuiBox-root.css-1qwnwpn');
    if (back) {
      back.click()
  }
    await this.sleep(1000);
  }
  }
  
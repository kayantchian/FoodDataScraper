    //Feito por Alexandre

class scrapyJotaja {
    constructor() {
      this.scrapedData = [];
      this.titleRestaurant = ""
    }
  
    sleep(ms) {     return new Promise(resolve => setTimeout(resolve, ms)); }
  
    
    async waitForElement(selector, context) {
      const timeout = 4000; // Set the timeout to 4 seconds (4000 milliseconds)
    
      return new Promise((resolve, reject) => {
        let intervalId;
    
        const clearAndReject = () => {
          clearInterval(intervalId);
          reject(false);
        };
    
        intervalId = setInterval(() => {
          const element = context ? context.querySelector(selector) : document.querySelector(selector);
          if (element) {
            clearInterval(intervalId);
            resolve(element);
          }
        }, 1000);
    
        // Set a timeout to reject the promise if the element is not found within the specified time
        setTimeout(clearAndReject, timeout);
      });
    }
    
      
      async waitForElementAll(context,selector) {
        if(context){
          return new Promise(resolve => {
            const intervalId = setInterval(() => {
              const element = context.querySelectorAll(selector);
              if (element) {
                clearInterval(intervalId);
                resolve(element);
              }
            }, 1000);
          });
        }
        else{
          return new Promise(resolve => {
            const intervalId = setInterval(() => {
              const element = document.querySelectorAll(selector);
              if (element) {
                clearInterval(intervalId);
                resolve(element);
              }
            }, 1000);
          });
        }
        ;
      }


      async checkRepetition(complementExpandable) {
        const chooserDiv = complementExpandable.querySelector('.inputItem_container__o31iB');
        if(chooserDiv){
        const plusButton = chooserDiv.querySelector('#mais');      
        plusButton.click(); 
        await this.sleep(500)
        plusButton.click();
        await this.sleep(500)
        const counter = chooserDiv.querySelector('input[type="text"]');
        const counterValue = parseInt(counter.value, 10);
        if (counterValue > 1) {
          return "com repeticao";
        } 
      }else {
        return "sem repeticao";
      }
      }
  
      async processTypeComplement(typeComplement, complementExpandable) {
        const complement = typeComplement.trim();
        let repetition = await this.checkRepetition(complementExpandable);
        let type = "";
        let minQtd = 0;
        let maxQtd = 0;
      
        if (complement.match(/^Selecione (\d+) Item/)) {
          const itemCount = parseInt(complement.match(/^Selecione (\d+) Item/)[1], 10);
          if (itemCount !== 1) {
            type = 'Mais de uma opcao ' + repetition;
            minQtd = itemCount;
            maxQtd = itemCount;
            
          }else(itemCount == "Selecione 1 Item");{
            type = "Apenas uma opcao";
            minQtd = 1;
            maxQtd = 1;
            
        }
        }else if (complement.match(/^Selecione até (\d+) Itens/)) {
          const maxItems = parseInt(complement.match(/^Selecione até (\d+) Itens/)[1], 10);
          type = 'Mais de uma opcao ' + repetition;
          maxQtd = maxItems;
        
        }else if (complement.match(/^Escolha de \d+ até \d+ Itens$/)) {
          const minMaxItems = complement.match(/\d+/g);
          const minItems = parseInt(minMaxItems[0], 10);
          const maxItems = parseInt(minMaxItems[1], 10);
          type = 'Mais de uma opcao ' + repetition;
          minQtd = minItems;
          maxQtd = maxItems;
        
        }
        return [type, minQtd, maxQtd];
      }
      
  
    async clickProductCards() {
     

      let header = document.querySelector('.header_contEmp__cgRNI')
      this.titleRestaurant = (header.querySelector('h1') || {}).textContent.trim() || '';

      console.log("executando..")
      await this.closeModal();
      await this.sleep(1000)
      let categoryDivs = document.querySelectorAll('.listaProdutos_boxListaProdutos__9fIq6');
    
      for await (const categoryIndex of [...Array(categoryDivs.length).keys()]) {
        let categoryDivs = document.querySelectorAll('.listaProdutos_boxListaProdutos__9fIq6');
        let categoryDiv = categoryDivs[categoryIndex];
        let categoryNameElement = categoryDiv.querySelector('h2');
        let categoryName = categoryNameElement ? categoryNameElement.textContent : "";
        let productCards = await this.waitForElementAll(categoryDiv,".listaProdutos_itemInlineDiv__Lpfvs");
        console.log(productCards)
        
        let productData = [];
        
        for await (const productIndex of [...Array(productCards.length).keys()]) {
          let categoryDivs = document.querySelectorAll('.listaProdutos_boxListaProdutos__9fIq6');
          let categoryDiv = categoryDivs[categoryIndex];
          let productCards = await this.waitForElementAll(categoryDiv,".listaProdutos_itemInlineDiv__Lpfvs");
          let productCard = productCards[productIndex];
          let productTitle = ""
          let productPrice = ""
          let imgSrc = ""
          let productDescricao = ""

          
        let titleElement = await this.waitForElement('h3',productCard);
        let priceElement = productCard.querySelector('.ItemInline_preco__uJ1fw');
        let imgElement = productCard.querySelector('img[data-nimg]');
        let descricaoElement = productCard.querySelector('p');
        productTitle = titleElement ? titleElement.textContent : "";
        let priceText = priceElement ? priceElement.textContent : "";
        productPrice = priceText.replace(/[^\d,.]/g, '').replace('.', ',')
        imgSrc = imgElement ? imgElement.src : "";
        productDescricao = descricaoElement ? descricaoElement.textContent : "";
        
          let productClickEvent = productCard.querySelector(".listaProdutos_itemInlineDiv__Lpfvs a[href]");
          let complementsDict = [];
          if (productClickEvent) {
            productClickEvent.scrollIntoView() 
            productClickEvent.click();
            console.log("CLicou")
            await this.sleep(1000)

            
            const formElement = await this.waitForElement("form");
            const complementExpandables = await this.waitForElementAll(formElement,'div:has(> .opcionais_itemOpcional__ZLk8q)');

            for await (const complementExpandable of complementExpandables) {
              let complementElements = complementExpandable.querySelectorAll('.opcionais_itemOpcional__ZLk8q');
              let optionsComplement = [];
              
              
    
              // Pegar o nome de cada complemento
              for await (const complementElement of complementElements) {
                
                
                let typeComplementElement = complementElement.querySelector('h4');
                let complementNameElement = complementElement.querySelector('h2');
                let requiredElement = complementElement.querySelector('small');
                let typeComplementText = typeComplementElement ? typeComplementElement.textContent : "";

                let [typeComplement, minQtd, maxQtd] = await this.processTypeComplement(typeComplementText, complementExpandable)
                let required = requiredElement ? requiredElement.textContent : "";
                let complementName = complementNameElement ? complementNameElement.textContent : "";
                // Pegar nome de cada opção do complemento da iteração
                

                let optionsElements = await this.waitForElementAll(complementExpandable,'.listaInputIncremental_OptionalWithImg__7xtBD, .listaInputRadio_OptionalWithImg__gA0q3');
                
                let optionTitle = "";
                let optionPrice = "0";
                let optionDescription = "";

                for await (const optionElement of optionsElements) {
                  
                  if(optionElement.classList.contains('listaInputIncremental_OptionalWithImg__7xtBD')){
                    let optionTitleElement = optionElement.querySelector('h3');
                    let optionPriceElement = optionElement.querySelector('div > div > div');
                    optionTitle = optionTitleElement ? optionTitleElement.textContent : "";
                    let optionPriceText = optionPriceElement ? optionPriceElement.textContent : "0";
                    optionPrice = optionPriceText.replace(/[^\d,.]/g, '').replace('.', ',');
                  }else if(optionElement.classList.contains('listaInputRadio_OptionalWithImg__gA0q3')){
                    let optionTitleElement = optionElement.querySelector('h3');
                    let optionPriceElement = optionElement.querySelector('div > div > div');
                    optionTitle = optionTitleElement ? optionTitleElement.textContent : "";
                    let optionPriceText = optionPriceElement ? optionPriceElement.textContent : "0";
                    optionPrice = optionPriceText.replace(/[^\d,.]/g, '').replace('.', ',')
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
            // console.log("IMAGEM: ", imgSrc)
            // console.log("DESCRIÇAO: ", productDescricao)
            console.log("- - - - - - - - - - - - - - - - - ")
            console.log("                                  ")
            await this.backPage();
            await this.sleep(2000)
            await this.closeModal();
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
    let back = document.querySelector('button[aria-label="Voltar"]')
    if (back) {
      console.log("Voltou")
      back.click()
  }
}

  async closeModal() {
    await this.sleep(1000);
    let modalElement = document.querySelector('.modal_boxModal__820K1');

    if (modalElement) {
      modalElement.style.display = 'none';
    }else{
      
    }
  
  }
  }

  
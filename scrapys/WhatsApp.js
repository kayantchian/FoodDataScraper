class ScrapyWhatsApp {
    constructor() {
      this.scrapedData = [];
      this.titleRestaurant = ""
    }
  
    sleep(ms) {     return new Promise(resolve => setTimeout(resolve, ms)); }
  
 
   
  
    async clickProductCards() {
      console.log("executando..");
      await this.sleep(1000);
      let categoryDivs = document.querySelectorAll('.xvpee5o.x1y332i5.x178xt8z.x13fuv20.xyj1x25._ak72._ak7l._ak7s._ak7w, .x1okw0bk.x6ikm8r.x10wlt62.xwib8y2.x1xmf6yo');
  
      for await (const categoryIndex of [...Array(categoryDivs.length).keys()]) {
         

          let categoryDivs = document.querySelectorAll('.xvpee5o.x1y332i5.x178xt8z.x13fuv20.xyj1x25._ak72._ak7l._ak7s._ak7w, .x1okw0bk.x6ikm8r.x10wlt62.xwib8y2.x1xmf6yo');
          let categoryDiv = categoryDivs[categoryIndex];
          let categoryNameElement = categoryDiv.querySelector('.x1iyjqo2.x6ikm8r.x10wlt62.x1n2onr6.xlyipyv.xuxw1ft._ao3e');
          let categoryName = categoryNameElement ? categoryNameElement.textContent : "";
          if (categoryName.toLowerCase() !== "todos os itens"){
          console.log(categoryName);
          await this.sleep(500);
          categoryDiv.querySelector("._ak8l._ak8m > a").click()
          await this.sleep(1000);
          let categoryInternal = document.querySelector(".x1okw0bk.xwib8y2.x6ikm8r.x10wlt62");
          let productCards = categoryInternal.querySelectorAll(".x10l6tqk.xh8yej3.x1g42fcv");
          await this.sleep(2000);
          let productData = [];

          for await (const productIndex of [...Array(productCards.length).keys()]) {
            let categoryDivs = document.querySelector(".x1okw0bk.xwib8y2.x6ikm8r.x10wlt62");
            let productCards = categoryDivs.querySelectorAll(".x10l6tqk.xh8yej3.x1g42fcv");
            let productCard = productCards[productIndex];
            console.log(productCard)

              await this.sleep(500);

              
              let titleElement = productCard.querySelector('.x1iyjqo2.x6ikm8r.x10wlt62.x1n2onr6.xlyipyv.xuxw1ft._ao3e');
              let descricaoElement = productCard.querySelectorAll('.x1c4vz4f.xs83m0k.xdl72j9.x1g77sc7.x78zum5.xozqiw3.x1oa3qoh.x12fk4p8.xeuugli.x2lwn1j.x1nhvcw1.x1q0g3np.x1cy8zhl')[0]
              let productTitle = titleElement ? titleElement.textContent : "";
              let priceElement = productCard.querySelectorAll('.x1c4vz4f.xs83m0k.xdl72j9.x1g77sc7.x78zum5.xozqiw3.x1oa3qoh.x12fk4p8.xeuugli.x2lwn1j.x1nhvcw1.x1q0g3np.x1cy8zhl')[1];

              // Seleciona o elemento que contém o preço normal (dentro de <del>, caso exista)
              let promoPriceElement = priceElement.querySelector("del._ao3e");

              // Inicializa as variáveis
              let productPromoPrice = ""; // Preço promocional
              let productPrice = 0;      // Preço normal

              if (promoPriceElement) {
                  // Caso tenha promoção, extrai os dois preços
                  let pricesText = priceElement.textContent.trim();
                  let prices = pricesText.match(/(?:BRL\s?)(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2}))/g);

                  if (prices && prices.length >= 2) {
                      // Primeiro preço é o promocional
                      productPromoPrice = prices[0].replace(/[^\d,]/g, '').replace(',', '.');

                      // Segundo preço é o normal
                      productPrice = prices[1].replace(/[^\d,]/g, '').replace(',', '.');
                  }
              } else {
                  // Caso não tenha promoção, pega apenas o preço normal
                  let priceText = priceElement ? priceElement.textContent : "";
                  productPrice = priceText.replace(/[^\d,]/g, '').replace(',', '.');
              }
            
              let imgSrc = "";
              let productDescricao = descricaoElement ? descricaoElement.textContent : "";
              let optionsComplement = []
              let complementsDict = []
              let optionTitle = ""
              let optionPrice = ""
              let optionDescription = ""
              let optionImg = ""
              let complementName = ""
              let typeComplement = ""
              let minQtd = ""
              let required = ""
              let maxQtd = ""

              //FINALIZAR ESSA PARTE 
            await this.sleep(2000)

            optionsComplement.push({
              optionTitle: optionTitle,
              optionPrice: optionPrice,
              optionDescription: optionDescription,
              optionImg: optionImg
            });

            complementsDict.push({
                nameComplement: complementName,
                typeComplement: typeComplement,
                minQtd: minQtd,
                maxQtd: maxQtd,
                required: required,
                options: optionsComplement
              })

            productData.push({
              title: productTitle,
              price: productPrice,
              promoPrice : productPromoPrice,
              imgSrc: imgSrc,
              descricao: productDescricao,
            });
            console.log("- - - - - - - - - - - - - - - - - ")
            console.log("NOME PRODUTO: ", productTitle)
            console.log("PREÇO PRODUTO: ", productPrice)
            console.log("PREÇO PROMOCIONAL : ", productPromoPrice)
            console.log("IMAGEM: ", imgSrc)
            console.log("DESCRIÇAO: ", productDescricao)
            console.log("- - - - - - - - - - - - - - - - - ")
            console.log("                                  ")
            
            
        }
        this.scrapedData.push({
          categoryName: categoryName,
          productsCategory: productData
        });
        await this.backPage(); 
        await this.sleep(1000)
        }
      }
      //alert("Finalizado!")
  }
  
  
  async backPage() {
    await this.sleep(1000);
    let back = document.querySelector('.x1okw0bk.x16dsc37.x1ypdohk.xeq5yr9.xfect85')
    if (back) {
      console.log("Voltou")
      back.click()
  }
  }
  }
  
  
  
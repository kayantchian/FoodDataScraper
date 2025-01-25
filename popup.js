document.addEventListener('DOMContentLoaded', function () {
  const coletarDadosButton = document.getElementById('coletarDados');
  const restauranteCheckbox = document.getElementById('restauranteCheckbox');

  // Função para obter o nome do restaurante a partir da URL
  function getRestaurantFromUrl(url) {
    const sites = [
      { urlPattern: /^https:\/\/.*\.anota\.ai\/.*/, value: "Anotai" },
      { urlPattern: /^https:\/\/.*\.menudino\.com\/.*/, value: "Dino" },
      { urlPattern: /^https:\/\/.*\.goomer\.app\/.*/, value: "Goomer" },
      { urlPattern: /^https:\/\/.*\.ola\.click\/.*/, value: "OlaClick" },
      { urlPattern: /^https:\/\/.*\.olaclick\.net\/.*/, value: "OlaClick" },
      { urlPattern: /^https:\/\/.*\web\.whatsapp\.com\/.*/, value: "WhatsApp" },
      { urlPattern: /^https:\/\/instadelivery\.com\.br\/.*/, value: "InstaDelivery" },
      { urlPattern: /^https:\/\/www\.hubt\.com\.br\/.*/, value: "Hubt" },
      { urlPattern: /^https:\/\/deliverydireto\.com\.br\/.*/, value: "Coisa Ruim" },
      { urlPattern: /^https:\/\/semola\.strelo\.com\.br\/.*/, value: "Semola" },
      { urlPattern: /^https:\/\/www\.vucafood\.com\.br\/.*/, value: "VucaFood" },
      { urlPattern: /^https:\/\/www\.diggy\.menu\/.*/, value: "Diggy" },
      { urlPattern: /^https:\/\/app\.jotaja\.com\/.*/, value: "Jotaja" },
      { urlPattern: /^https:\/\/.*\.cardapioweb\.com\/.*/, value: "CardapioWeb" },
      { urlPattern: /^https:\/\/.*\.yooga\.app\/.*/, value: "Yooga" },
      { urlPattern: /^https:\/\/.*\.cardapiodigital\.io\/.*/, value: "CardapioDigital" },
      { urlPattern: /^https:\/\/.*\.saipos\.com\/.*/, value: "Saipos" }
    ];

    const matchingSite = sites.find(site => url.match(site.urlPattern));
    return matchingSite ? matchingSite.value : null;
  }

  // Atualizar seleção do dropdown ao mudar a guia
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const selectedRestaurant = getRestaurantFromUrl(tabs[0].url);
    if (selectedRestaurant) {
      restauranteCheckbox.value = selectedRestaurant;
    }
  });

  coletarDadosButton.addEventListener('click', async function () {
    const selectedRestaurante = restauranteCheckbox.value;
    var message = { restaurante: selectedRestaurante };

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, message);
    });
  });
});

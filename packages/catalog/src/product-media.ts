import type { Product } from './types';

export type ProductMedia = Pick<Product, 'imageUrl' | 'galleryUrls' | 'imageSourceUrl'>;

/**
 * Real product/supplier media for commercially enabled BR SKUs.
 * These URLs are deliberately separate from imageKey, which remains a technical fallback only.
 * Do not add a SKU here until the visual has been checked against the actual sourced product.
 */
export const productMediaBySku: Record<string, ProductMedia> = {
  'SRC-BR-TAG-001': {
    imageUrl: 'https://http2.mlstatic.com/D_920037-MLB103419973601_012026-O.jpg',
    galleryUrls: [],
    imageSourceUrl: 'https://lista.mercadolivre.com.br/chaveiro-localiza',
  },
  'SRC-BR-PARK-001': {
    imageUrl:
      'https://someacessorios.com.br/media/catalog/product/cache/1/image/1800x/040ec09b1e35df139433887a97daa66f/1/4/14169-sensor_estacionamento_18_5mm_preto-3.jpg',
    galleryUrls: [
      'https://image.made-in-china.com/2f0j00SyDtWimhAqrL/Easy-Parking-Front-Rear-Bumper-Car-Reverse-Park-Sensors.jpg',
    ],
    imageSourceUrl:
      'https://someacessorios.com.br/sensor-estacionamento-re-universal-4-pontos-18-5mm-display-led.html',
  },
  'SRC-BR-PARK-002': {
    imageUrl:
      'https://cdn.awsli.com.br/2500x2500/1602/1602790/produto/110711410/6e1ac92586.jpg',
    galleryUrls: [
      'https://image.made-in-china.com/2f0j00afEYWzyBmgkt/LED-Buzzer-Parking-Sensor-Four-Points-Car-Reversing-Assistant-System.jpg',
    ],
    imageSourceUrl:
      'https://www.mbutilidades.com.br/kit-sensor-de-estacionamento-4-pontos-camera-re',
  },
  'SRC-BR-CHG-001': {
    imageUrl:
      'https://dcdn-us.mitiendanube.com/stores/003/383/022/products/496-89a92278cf1b2b6c9d17677889675524-480-0.webp',
    galleryUrls: [],
    imageSourceUrl:
      'https://www.henbercom.com/produtos/carregador-veicular-turbo-hmaston-lo7-675w-2-saidas-usb-c-45w-e-usb-a-225w-12v-a-24v-carros-e-caminhoes-20qw0/',
  },
  'SRC-BR-CHG-002': {
    imageUrl:
      'https://i5.walmartimages.com/seo/Car-Charger-66W-Super-Fast-Charging-USB-PD-QC-3-0-Voltmeter-LED-Lights-Universal-Quick-Charge-12-24V-Car-Cigarette-Lighter-Plug-Compatible-iPhone-14_cd54167a-ea19-48bb-b840-0aac729ce2a7.5daf4220e52e15b05af42c94bbb5f7ba.jpeg?odnBg=FFFFFF&odnHeight=576&odnWidth=576',
    galleryUrls: [
      'https://http2.mlstatic.com/D_NQ_NP_681503-MLA100083833179_122025-O.webp',
    ],
    imageSourceUrl:
      'https://www.walmart.com/c/kp/cigarette-lighter-voltmeter',
  },
  'SRC-BR-ENE-002': {
    imageUrl:
      'https://down-br.img.susercontent.com/file/br-11134207-7r98o-m8p12wtlrqfl3f',
    galleryUrls: [],
    imageSourceUrl:
      'https://shopee.com.br/Bomba-de-Ar-Port%C3%A1til-Inteligente-Auxiliar-de-Partida-fun%C3%A7%C3%A3o-4-em-1-PowerBank-com-Bateria-Integrada-i.1480402059.22898424119',
  },
  'SRC-BR-MOUNT-001': {
    imageUrl:
      'https://dcdn.mitiendanube.com/stores/001/437/198/products/f8df204a93a56ea44544664bce0b586dawsaccesskeyidakiatclmsgfx4j7tu445expires1691258749signaturekspgdnaif3cryoijtohrjdigai83d-ae613bdc4a918cd7cf16886667544857-1024-1024.jpg',
    galleryUrls: [],
    imageSourceUrl:
      'https://fast25online.com.br/produtos/suporte-veicular-hmaston-cj-65-de-tracao-magnetica-super-forte-360sem-ponto-cego-original/',
  },
  'SRC-BR-BIN-001': {
    imageUrl:
      'https://down-br.img.susercontent.com/file/br-11134207-7r98o-lrrp2nchov0tc7',
    galleryUrls: [
      'https://cdn.awsli.com.br/800x800/1963/1963744/produto/328379157/adb09bb360c94daecef2221697fdda54-zpky5kxguc.jpg',
    ],
    imageSourceUrl:
      'https://www.fazaboa.com.br/ofertas/shopee/6143884',
  },
};
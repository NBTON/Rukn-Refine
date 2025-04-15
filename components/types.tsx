// types.ts
export interface MarketplaceItem {
  id: string;
  title: string;
  price: string;
  size: string;
  location: string;
  image: keyof typeof images; // must match one of the keys in our images mapping
}

// Mapping for dynamic image imports.
export const images = {
  "../assets/images/dummy1.png": require("../assets/images/dummy1.png"),
  "../assets/images/dummy2.png": require("../assets/images/dummy2.png"),
  "../assets/images/dummy3.png": require("../assets/images/dummy3.png"),
  "../assets/images/dummy4.png": require("../assets/images/dummy4.png"),
};

export const MARKETPLACES: MarketplaceItem[] = [
  {
    id: "1",
    title: "مناسب لفكرتك بنسبة 96%",
    price: "30,000 ريال / سنة",
    size: "400 متر مربع",
    location: "الخبر, السعودية",
    image: "../assets/images/dummy3.png",
  },
  {
    id: "2",
    title: "مناسب لفكرتك بنسبة 97%",
    price: "30,000 ريال / سنة",
    size: "420 متر مربع",
    location: "الدمام, السعودية",
    image: "../assets/images/dummy2.png",
  },
  {
    id: "3",
    title: "مناسب لفكرتك بنسبة 90%",
    price: "25,000 ريال / سنة",
    size: "380 متر مربع",
    location: "الرياض, السعودية",
    image: "../assets/images/dummy1.png",
  },
  {
    id: "4",
    title: "مناسب لفكرتك بنسبة 90%",
    price: "25,000 ريال / سنة",
    size: "380 متر مربع",
    location: "الرياض, السعودية",
    image: "../assets/images/dummy4.png",
  },
  {
    id: "5",
    title: "مناسب لفكرتك بنسبة 90%",
    price: "25,000 ريال / سنة",
    size: "380 متر مربع",
    location: "الرياض, السعودية",
    image: "../assets/images/dummy3.png",
  },
  {
    id: "6",
    title: "مناسب لفكرتك بنسبة 90%",
    price: "25,000 ريال / سنة",
    size: "380 متر مربع",
    location: "الرياض, السعودية",
    image: "../assets/images/dummy1.png",
  },
  {
    id: "7",
    title: "مناسب لفكرتك بنسبة 90%",
    price: "25,000 ريال / سنة",
    size: "380 متر مربع",
    location: "الرياض, السعودية",
    image: "../assets/images/dummy2.png",
  },
];

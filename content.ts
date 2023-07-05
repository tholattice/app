interface DictionaryEntry {
    homeHeader: string
    homeContent: string
    aboutHeader: string
    aboutContent: string
    metaTitle: string
    metaDescription: string
    layoutTag: string
  }
  
  export const dictionary: Record<string, DictionaryEntry> = {
    
    // home: {
    //   homeHeader: "Home",
    //   homeContent: "Welcome to my home.",
    //   aboutHeader: "About Me",
    //   aboutContent: "Here is some information about me. English is my primary language."
    // },
    site1: {
      homeHeader: "Casa",
      homeContent: "Beinvenidos a mi casa.",
      aboutHeader: "Sobre Yo",
      aboutContent: "Aqui tenemos un poco informacion sobre yo. Hablo espanol tambien.",
      metaTitle: "Site1 Title",
      metaDescription: "Site1 Description",
      layoutTag: "Site1 Layout"
    },
    site2: {
      homeHeader: "Wow",
      homeContent: "Beinvenidos a mi Wow.",
      aboutHeader: "Sobre Wow",
      aboutContent: "Aqui Wow un poco informacion sobre yo. Hablo espanol tambien.",
      metaTitle: "Site2 Title",
      metaDescription: "Site2 Description",
      layoutTag: 'Site2 Layout'
    }
  }
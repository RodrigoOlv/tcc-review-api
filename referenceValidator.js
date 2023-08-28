const checkReferences = (content) => {
    const references = content.match(/\[(\d+)\]/g); // Encontra todas as referências no formato "[n]"
    const citations = content.match(/\[(\d+)\]/g);   // Encontra todas as citações no formato "[n]"
    
    if (references && citations) {
        const missingReferences = citations.filter(citation => !references.includes(`[${citation.slice(1, -1)}]`));
        return missingReferences;
    }
  
    return null;
};

module.exports = { checkReferences };
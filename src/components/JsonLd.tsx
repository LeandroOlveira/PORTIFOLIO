/**
 * Um bloco `application/ld+json` no HTML.
 *
 * O escape de `<` é o que impede que um título de projeto ou de nota contendo
 * `</script>` feche a tag cedo e derrube o resto da página. `<` é JSON
 * válido e o parser do buscador o lê como o caractere original.
 */
export function JsonLd({ dados }: { dados: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(dados).replace(/</g, '\\u003c'),
      }}
    />
  );
}

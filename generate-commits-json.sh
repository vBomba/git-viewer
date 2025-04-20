#!/bin/bash

OUTPUT_PATH="src/assets/commits.json"
mkdir -p src/assets
echo "[" > "$OUTPUT_PATH"

COMMITS=$(git log --pretty=format:"%H")

i=0
total=$(echo "$COMMITS" | wc -l)

while IFS= read -r hash; do
  author=$(git show -s --format='%an' "$hash")
  date=$(git show -s --format='%ad' "$hash")
  message=$(git show -s --format='%s' "$hash")
  parents=$(git show -s --format='%P' "$hash")
  branches=$(git branch --contains "$hash" --format="%(refname:short)" | paste -sd "," -)

  echo "  {" >> "$OUTPUT_PATH"
  echo "    \"hash\": \"$hash\"," >> "$OUTPUT_PATH"
  echo "    \"author\": \"$author\"," >> "$OUTPUT_PATH"
  echo "    \"date\": \"$date\"," >> "$OUTPUT_PATH"
  echo "    \"message\": \"$message\"," >> "$OUTPUT_PATH"
  echo "    \"source\": \"$parents\"," >> "$OUTPUT_PATH"
  echo "    \"branches\": [$(echo $branches | sed 's/[^,]*/"&"/g')]" >> "$OUTPUT_PATH"

  i=$((i + 1))
  if [ "$i" -lt "$total" ]; then
    echo "  }," >> "$OUTPUT_PATH"
  else
    echo "  }" >> "$OUTPUT_PATH"
  fi
done <<< "$COMMITS"

echo "]" >> "$OUTPUT_PATH"

echo "✅ commits.json з гілками збережено у $OUTPUT_PATH"

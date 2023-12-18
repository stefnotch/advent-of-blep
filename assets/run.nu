# You need to have vengi-voxconvert.exe in the same folder as this script
# And the nushell needs to be used to run this script


let input = ls source | select name
let output = $input | get name | path parse | update parent "../static/models" | update extension gltf | path join
let input_output = $input | merge ($output | wrap "output")


try {
  $input_output | each {|it| ^./vengi-voxconvert.exe --force --input $it.name --output $it.output}
} catch {|e|
  print "Crashed"
  print $e
}
input "Press any key to continue . . ."

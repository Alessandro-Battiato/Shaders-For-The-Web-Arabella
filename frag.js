const frag = `

precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

uniform float seed;

uniform sampler2D image;

varying vec2 v_texcoord; 

vec2 aspect(vec2 uv, float texture_ratio, float canvas_ratio) {
    // if canvas is too "portrait" for the texture, stretch across
    // else canvas too "landscape for the texture", stretch down 
    if (texture_ratio > canvas_ratio) {
        float diff = canvas_ratio / texture_ratio;
        uv.x *= diff;
        // The following line of code always keeps the image "centered"
        uv.x += (1.0 - diff) / 2.0;
    } else {
        float diff = texture_ratio / canvas_ratio;
        uv.y *= diff;
        // The following line of code always keeps the image "centered"
        uv.y += (1.0 - diff) / 2.0;
    }
    
    return uv;
}

void main(void)
{
    vec2 uv = v_texcoord;
    // uv.y = 1.0 - uv.y; // flips the picture in the correct way, but only works on kodelife, it's fine otherwise in web
    
    // find out the aspect ratios
    float texture_ratio = 1200.0 / 1800.0; // The texture_ratio value, changes based on the images' sizes, currently 1200.0 / 1800.0 comes from the fact that the image we are using is 1200 px wide and 1800 px high, so these numbers for example won't work with the cat image which has a square resolution
    float canvas_ratio = u_resolution.x / u_resolution.y;
    
    // copy the original coordinate system
    vec2 coords = aspect(uv, texture_ratio, canvas_ratio);
    
    // make a safe area, this basically avoids pixelated edges or repeated pixels on the edges
    coords = mix(vec2(0.1, 0.1), vec2(0.9, 0.9), coords);
    
    // make a normalize mouse
    vec2 mouse = u_mouse / u_resolution;
    
    float blocks = 12.0;
    float x = floor(uv.x * blocks) / blocks; // the "blocks" effect is created thanks to the floor(uv.x * 12.0) because we are basically taking x and "cutting it" into 12x12 parts
    float y = floor(uv.y * blocks) / blocks;
    
    vec2 distortion = 0.1 * vec2(
        // The higher the values by which you multiply uv.x or uv.y, the more distorted the image becomes
        sin(u_time * 0.5 + x * 1.0 + y * 1.5 + mouse.x * 2.0 + mouse.y + seed), // adding uv.x and uv.y in the equation adds a little bit of distortion per pixel
        cos(u_time * 0.2 + x * 1.1 + y * 2.0 + mouse.x * 0.5 + mouse.y + seed)
    ); // combining sin(time) and cos(time) makes the image move in circle
    
    // START EXPERIMENT: this experiment serves no purpose other than sharing some fun results you can get when experimenting with GLSL
    
    // float dist = distance(vec2(0.5, 0.5), uv); // basically "how far is each point in it's original coordinate system from the center" so if it's right in the center, the resulting value is going to be 0, otherwise the value will increase
    // float strength = smoothstep(0.6, 0.0, dist); // if it's far away from the center we want the strength to be weaker
    
    // vec2 distortion = 0.1 * vec2(
    //     sin(time * strength * 0.1 / uv.x), 
    //     cos(time * strength * 0.1 / uv.y)
    // );
    
    // END EXPERIMENT
    
    vec4 color = texture2D(image, coords + distortion);
    
    gl_FragColor = color;
}

`;

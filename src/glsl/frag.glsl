uniform float uDelta;
//uniform vec2 mousePosition;
varying vec2 vUv;
uniform sampler2D uTexture;

uniform float uPlayerY;
uniform float uPlayerX;
uniform float uPlayerAngle;

void main() {
    float a = uPlayerAngle;
    a += 3.14159/2.0;
    vec2 pos = vUv - 0.5;
    float horizon = 0.2;
    vec3 color;

    if ((pos.y - horizon) > 0.0) {
        color = vec3(0.0, 0.0, 1.0);
    } else {
        float fov = 0.5;
        //float angle = 0.0;

        vec3 p = vec3(pos.x, fov, pos.y - horizon);
        vec2 s = vec2(p.x/p.z, p.y/p.z);

        mat2 rotationMat = mat2(cos(a), -sin(a),
                                sin(a), cos(a));

        vec2 texCoord = s * rotationMat;

        texCoord.x += uPlayerX;
        texCoord.y += uPlayerY;

        color = texture2D( uTexture, texCoord*.01).xyz;
    }

    gl_FragColor = vec4(color, 1.0);
}

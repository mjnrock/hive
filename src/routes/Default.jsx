import React from "react";
import "aframe";
import { Entity, Scene } from "aframe-react";

import { Context } from "./../App";

export function Default() {
	return (
		<div>
			<div className="f1">Hello</div>

			<Scene>
				<Entity light={{ type: "point" }} />
				{/* <Entity gltf-model={{ src: "virtualcity.gltf" }} /> */}
				<Entity
					text={{ value: "Hello, WebVR!" }}
					position={{ x: 150, y: 150, z: 0 }}
				/>
				{/* <Entity
					geometry={{ primitive: "box" }}
					material={{ color: "red" }}
					position={{ x: 0, y: 0, z: -5 }}
				/> */}
			</Scene>
		</div>
	);
}

export default Default;

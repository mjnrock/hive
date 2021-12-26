import Console from "./util/Console";
import Context from "./context/Context";

Console.NewContext();

const compound = Context.Create(Context.Types.Compound, [
	Context.Create(Context.Types.String, "Kiszka"),
	Context.Create(Context.Types.String, "Buddha"),
]);

console.log(compound);
console.log(compound.toObject());
console.log(compound.toJson());

const recomp = Context.FromObject(compound.toObject());
console.log(recomp.meta.id);